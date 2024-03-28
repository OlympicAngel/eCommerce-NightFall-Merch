const OrderModel = require(`../models/Order`);


module.exports = {
    guests: {
        //get order by id ONLY IF it doesnt have user associated with it (to prevent privacy leak)
        getByID: async (req, res) => {
            function censorWord(str) {
                if (!str)
                    return;
                const mid = ~~(str.length / 2.2);
                return str.slice(0, mid - 1) + "*".repeat(str.length - mid) + str.slice(-1);
            }

            function censorEmail(email = "") {
                if (!email || !email.includes("@"))
                    return censorWord(email);
                var arr = email.split("@");
                return censorWord(arr[0]) + "@" + censorWord(arr[1]);
            }
            try {
                const id = req.params.id;
                const order = await OrderModel.findOne({ _id: id, user: { $exists: false } }).populate(['products.product']).exec();
                if (!order)
                    throw new Error("הזמנה לא נמצאה")

                //censor user data
                order.customer.name = censorWord(order.customer.name);
                order.customer.email = censorEmail(order.customer.email);
                order.customer.phone = censorWord(order.customer.phone);
                order.customer.address.street = censorWord(order.customer.address.street);
                order.payment.paypal_id = censorWord(order.payment.paypal_id);
                order.payment.transaction_number = censorWord(order.payment.transaction_number);
                order.payment.last_digits = censorWord(order.last_digits);

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //user functions
    users: {
        getAll: async (req, res) => {
            try {
                const id = req.user
                const orders = await OrderModel.find({ user: id }).populate(['products.product']).exec();
                return res.status(200).json({
                    success: true,
                    message: `הזמנות נשלפו בהצלחה`,
                    orders
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף את ההזמנות`,
                    error: error.message
                })
            }
        },

        getByID: async (req, res) => {
            try {
                const id = req.params.id;
                const user = req.user;
                const order = await OrderModel.findOne({ _id: id, user }).populate(['products.product']).exec();
                if (!order)
                    throw new Error("הזמנה זו לא קיימת עבור משתמש זה")

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //manager functions
    managers: {
        getAll: async (req, res) => {
            try {
                let { page = 1, limit = 20 } = req.query;
                limit = Math.min(limit, 50) //limit to up to 50 per request
                //get product count
                const count = await OrderModel.count();
                const pages = Math.ceil(count / limit);

                const orders = await OrderModel.find()
                    .skip((page - 1) * limit).limit(limit)
                    .populate(['user', 'products.product']).exec();

                return res.status(200).json({
                    success: true,
                    message: `כל ההזמנות נשלפו בהצלחה`,
                    limit,
                    count,
                    pages,
                    orders
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף את כל ההזמנות`,
                    error: error.message
                })
            }
        },

        getByID: async (req, res) => {
            try {
                const order = await OrderModel.findById(req.params.id).populate([/* 'user', */'products.product']).exec();

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה זו`,
                    error: error.message
                })
            }
        },

        updateStatusByID: async (req, res) => {
            try {
                const id = req.params.id;

                await OrderModel.findByIdAndUpdate(id, { status: req.body.status }).exec();

                return res.status(200).json({
                    success: true,
                    message: `סטטוס הזמנה עודכן בהצלחה`
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לעדכן סטטוס הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //admin functions
    admins: {
        deleteByID: async (req, res) => {
            try {
                const id = req.params.id;

                await OrderModel.findByIdAndDelete(id).exec();

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נמחקה`
                })
            } catch (error) {
                return res.status(500).json({
                    message: `שגיאה במחיקת הזמנה`,
                    error: error.message
                })
            }
        }
    }
}