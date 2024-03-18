import { PayPalButtons } from "@paypal/react-paypal-js"
import { useContext, useEffect, useState } from "react"
import { Box, useToast } from "@chakra-ui/react";
import { CartContext } from "../context/CartProvider";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { toastError, toastSuccess } from "../utils/toast.helper";
import Loader from "./partials/Loader";
import { CartItem } from "../utils/types";


function BuyButton() {
    const { cartItems } = useContext(CartContext) //we extract here so the paypal button could listen to it & re render as needed
    const [isLoading, setIsLoading] = useState(true) //used to display only when loaded (prevent jumpy hitbox on container Box)

    //each change in cart will case to btn to reload - show a loading animation for that time
    useEffect(() => {
        setIsLoading(true)
    }, [cartItems])

    //create order from server logic
    const createOrder = genOrder()
    const onApprove = genApprove()
    const onCancel = genOnCancel();

    function preventClose(e) {
        e.preventDefault();
        return true
    }
    function removeCloseEvent() { window.removeEventListener("beforeunload", preventClose) }

    useEffect(() => {
        return;
        window.addEventListener("beforeunload", preventClose)
        return removeCloseEvent // remove when dismounting
    })

    //https://paypal.github.io/react-paypal-js/?path=/story/example-paypalbuttons--default&args=showSpinner:true
    return (
        <Box m={"0.5em auto"} minH="10em" zIndex={0} position={"relative"} textAlign={"center"} style={{ colorScheme: "light" }} bg="paypalBG" p="1em" pb="0" borderRadius={"0.4em"}
            border="solid 0.15em" borderColor="orange.300" boxShadow={"dark-lg"} w={"inherit"} maxW={"min(100%,600px)"}>
            <Box display={["block", "none"][~~isLoading]}>
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    showSpinner={true}
                    forceReRender={[cartItems]}
                    onInit={() => setIsLoading(false)}
                    style={{
                        label: "checkout",
                        color: "gold",
                        shape: "pill",
                        layout: "vertical",
                        maxWidth: "100%",
                        showSpinner: true,
                        disableMaxWidth: true,
                        background: "red"
                    }} />
            </Box>
            {isLoading && <Loader />}
        </Box>
    )
}


/**
 * sends the server the current cart - server communicate with PayPal and returns order controls from PayPal
 * @returns 
 */
function genOrder() {
    const toast = useToast()
    const { cartItems } = useContext(CartContext)
    const { SERVER } = useContext(AuthContext)

    return async function createOrder(data, actions) {
        try {
            //send the cart items to the server - then the server calls paypal and creates the order itself so users cant(easily) edit it at their side
            const res = await axios.post(`${SERVER}orders/api/create`, { cart: cartItems })
            const orderData = res.data;

            //if we got an id - all good - return it to the button component
            if (orderData.id) {
                return orderData.id;
            } else {
                //if we get paypal related error
                //parse error from response
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);
                //show to user
                toastError(new Error(errorMessage), toast);
                throw new Error(errorMessage);
            }
        } catch (e) {
            console.log(e)
            if (e?.response?.data?.noCart) {
                //TODO: handle no cart error {noCart: true}
            } else if (e?.response?.data?.cartChanged) {
                /** @type {CartItem[]} */
                const { newCart } = e.response.data;
                //TODO: show message and possibly compare whats changed
            }
            toastError(e, toast);
        }
    }
}

function genApprove() {
    const toast = useToast()
    const { resetCart } = useContext(CartContext)
    const { SERVER } = useContext(AuthContext)

    return async function (data, actions) {
        try {
            console.log(data)
            const response = await axios.post(`${SERVER}orders/api/${data.orderID}/capture`)
            const orderData = response.data;
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                toastError(new Error("סירוב לחיוב, יש לנסות שוב"), toast);
                return actions.restart();
            }
            // (2) Other non-recoverable errors -> Show a failure message
            if (errorDetail)
                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);

            if (!orderData.purchase_units)
                throw new Error(JSON.stringify(orderData));


            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            toastSuccess(`הזמנה נוספה למערכת!`, toast)

            const { orderId } = orderData;

            resetCart(); //reset cart
            navigate("/"); //TODO: navigate to order finished page
        } catch (e) {
            toastError(e, toast);
            console.error(e);
        }
    }

}

function genOnCancel() {
    const toast = useToast()
    const { SERVER } = useContext(AuthContext);
    return async (data, actions) => {
        console.warn("Cancel", data, actions);
        try {
            const res = await axios.post(`${SERVER}orders/api/${data.orderID}/cancel`)
            toastSuccess(res.data.message, toast)
        } catch (e) {
            toastError(e, toast);
        }
    }
}

function onError(data, actions) {
    console.warn("error", data, actions)
}
export default BuyButton