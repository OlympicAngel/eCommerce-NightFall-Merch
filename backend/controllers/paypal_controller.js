//https://developer.paypal.com/docs/checkout/standard/integrate/

const { justCheck } = require("../middlewares/auth_user");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = process.env.NODE_ENV == "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

/**
* Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
* @see https://developer.paypal.com/api/rest/authentication/
*/
const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

/**
* @typedef {Object} CartItem
* @property {String} product
* @property {Number} quantity
* @property {{price:number}} ref
*/

async function fillOrderWithProduct(cart) {
    try {
        //create set and fill it with all the different id's of products - only getting unique ids
        const prodID_set = new Set();
        cart.forEach(item => prodID_set.add(item.product))

        //get all products for server and hook it to shop cart we got from user
        const productList = await Product.find({ '_id': { $in: [...prodID_set] } })
        const serverMap = cart.map(item => ({
            product: item.product,
            quantity: ~~item.quantity, //round it if user sent us not whole number
            ref: productList.find(p => p.id == item.product)
        }))
        //remove all items that might be user malformed OR not exist anymore (in case of really old cart?)
        const filteredCart = serverMap.filter(item => item.ref != undefined && !isNaN(item.quantity))

        let isCartError = filteredCart.length != cart.length
        return { filteredCart, }
    }
    catch (e) {
        return { isCartError: true }
    }
}

/**
 * Create an order to start the transaction.
 * FLOW:
 * 1. create order on DB
 * 2. convert cart items into paypal's formate
 * 3. sending request to paypal
 * 4. adding data from paypal into the order we just made
 * 5. returning req to client to perform the payment for the order
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 * @param {CartItem[]} filteredCart 
 * @returns 
 */
const createOrderLogic = async (filteredCart, user) => {
    let customer;
    if (user) //if user exists get customer data from it.
        customer = { ...{ name, email, phone, address } = user }
    const order = Order({
        "user": user?._id, //if user exists - link him to order
        customer,
        //get product list fitting to "order formate"
        products: filteredCart.map(p => ({
            ...{ product, quantity } = p,
            RTP: p.ref.price
        }))
    })
    await order.save() //save order to get its _id

    const fixInt = (num) => parseFloat(num.toFixed(2));
    //convert to paypal items
    const items = filteredCart.map(i => {
        const tax = fixInt(i.ref.price * 0.17);
        return {
            name: i.ref.name,
            quantity: i.quantity,
            image_url: i.ref.image || undefined,
            tax: {
                currency_code: "ILS",
                value: tax
            },
            unit_amount: {
                currency_code: "ILS",
                value: fixInt(i.ref.price - tax),
            }
        }
    })

    //get paypal token
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    //generate order logic
    const totalSum = items.reduce((pre, i) => pre + i.unit_amount.value * i.quantity, 0);
    const taxSum = items.reduce((pre, i) => pre + i.tax.value * i.quantity, 0);
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                custom_id: order._id, //hook order id so it will be shown on paypal for better handling in case of disputes
                description: "רכישה מחנות המרצ' של נייטפול", //shown to user after the order
                items,
                amount: {
                    currency_code: "ILS",
                    value: fixInt(totalSum) + fixInt(taxSum),
                    breakdown: {
                        item_total: {
                            currency_code: "ILS",
                            value: fixInt(totalSum),
                        },
                        tax_total: {
                            currency_code: "ILS",
                            value: fixInt(taxSum),
                        }
                    }
                }
            }
        ],
        payment_source: {
            paypal: {
                experience_context: {
                    brand_name: "נייטפול מרצ'",
                    payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED", //allows only instant payments
                }
            }
        }
    };

    const req = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            //"PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            //"PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            //"PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    const response = await handleResponse(req);
    //if request went well
    if (req.ok && response?.jsonResponse?.id) {
        //save paypal order request id (its NOT order id as shown on paypal dashboard)   
        order.payment.paypal_id = response.jsonResponse.id;
        await order.save();
    }

    return response;
};


/**
* Capture payment for the created order to complete the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/
const captureOrderLogic = async (orderID) => {
    const order = await Order.findOne({ "payment.paypal_id": orderID, status: 1 });
    if (!order)
        throw new Error("עסקה בוטלה - לא היה ניתן למצוא את ההזמנה בשרת")

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
    });
    //get response from paypal
    const orderResponseObj = await handleResponse(response);
    const orderResponse = orderResponseObj.jsonResponse;

    if (response.ok) {
        orderResponseObj.jsonResponse.orderID = order._id; //hook order id for the client to show later

        const errorDetail = orderResponse?.details?.[0];
        //if we dont have an error & we did got items that the user buy => successful payment
        if (!errorDetail && orderResponse.purchase_units) {
            const orderData = orderResponse.purchase_units[0];
            const email = orderResponse.payer.email_address;
            const user = orderData.shipping;
            const payment = orderData.payments.captures[0];

            order.customer.name = user.name.full_name || order.customer.name;
            order.customer.email = order.customer.email || email;
            //if address is not defined (in case of a guest or user without address[?])
            if (!order.customer.address.city && !order.customer.address.street) {
                order.customer.address.city = user.address.admin_area_2;
                order.customer.address.street = user.address.address_line_1.split(" ").slice(0, -1).join(" ");
                order.customer.address.building = user.address.address_line_1.split(" ").pop();
                //if street has no spaces - copy it raw
                if (!order.customer.address.street) {
                    order.customer.address.street = user.address.address_line_1
                    delete order.customer.address.building;
                }
            }
            //get paypal fee
            order.payment.paypal_fee = payment.seller_receivable_breakdown.paypal_fee.value
            order.payment.date = payment.create_time; //get date
            order.payment.transaction_number = payment.id; //get id
            order.status = 2;
            order.expireAt = null
            await order.save();

            if (order.user)
                await User.findByIdAndUpdate(order.user, { $inc: { 'orders': 1 } })
        }
    }

    return orderResponseObj;
};

async function handleResponse(response) {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

module.exports = {
    createOrder: async (req, res) => {
        try {
            //get & check we have valid list of products items
            const { cart } = req.body;
            if (!cart || !(cart instanceof Array) || cart.length <= 0)
                return res.status(401).json({
                    message: `סל קניות ריק!`,
                    noCart: true,
                    error: "לא הוספת כלום לסל הקניות שלך!"
                })

            //fill list with product data from the server - if we get a miss-match(missing product etc - throw error to client)
            const { filteredCart, isCartError } = await fillOrderWithProduct(cart)
            if (isCartError)
                return res.status(401).json({
                    message: `סל הקניות שלך עבר איפוס!`,
                    cartChanged: true,
                    error: "כי הוא מכיל מוצרים עם מידע ישן.."
                })

            //try to import user from request - if any
            await justCheck(req)

            //create & send order  obj paypal - returns paypal's response
            const { jsonResponse, httpStatusCode } = await createOrderLogic(filteredCart, req.user);
            res.status(httpStatusCode).json(jsonResponse);
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "שגיאה ביצירת ההזמנה",
                error: e.message
            });
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const { orderID } = req.params;
            if (!orderID)
                throw new Error("לא התקבלה הזמנה לביטול?")
            //find & delete by paypal's id - ONLY if payment was not made (status 1)
            const order = await Order.findOneAndDelete({ "payment.paypal_id": orderID, status: 1 })
            if (!order)
                throw new Error("הזמנה כבר נמחקה מהמערכת");
            return res.status(200).json({
                success: true,
                message: `הליך הזמנה בוטל, יש לנסות שנית.`,
            })
        } catch (e) {
            return res.status(401).json({
                message: "פעולת ביטול נכשלה",
                error: e.message
            });
        }
    },
    captureOrder: async (req, res) => {
        try {
            const { orderID } = req.params;
            const { jsonResponse, httpStatusCode } = await captureOrderLogic(orderID);
            res.status(httpStatusCode).json(jsonResponse);
        } catch (e) {
            console.error("Failed to create order:", e);
            res.status(500).json({
                message: "",
                error: e.message
            });
        }
    }
}