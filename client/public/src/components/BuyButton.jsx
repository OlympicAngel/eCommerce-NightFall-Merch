import { PayPalButtons } from "@paypal/react-paypal-js"
import { useContext, useEffect, useRef, useState } from "react"
import { Box, Card, useToast } from "@chakra-ui/react";
import { CartContext } from "../context/CartProvider";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { toastError, toastSuccess } from "../utils/toast.helper";
import Loader from "./partials/Loader";
import { CartItem } from "../utils/types";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


function BuyButton(props) {
    const { cartItems } = useContext(CartContext) //we extract here so the paypal button could listen to it & re render as needed
    const [isLoading, setIsLoading] = useState(true) //used to display only when loaded (prevent jumpy hitbox on container Box)

    //each change in cart will case to btn to reload - show a loading animation for that time
    useEffect(() => {
        setIsLoading(true)
    }, [cartItems])

    //get height of btn to animate it opening/closing
    const containerRef = useRef();
    const [updateSize, setUpdateSize] = useState()
    const toggleSize = () => setUpdateSize(p => !p)
    useEffect(() => {
        let initialHeight = containerRef.current.scrollHeight;
        let updated = 0;
        let cycles = 0;
        let inter;
        const update = () => {
            const height = containerRef.current?.scrollHeight;
            if (initialHeight == height) { //if no change in height
                if (updated > 5) //if already changed once - stop loop
                    clearInterval(inter)
                return;
            }
            updated++; //set updated
            initialHeight = height; //update for later check (first if)
            containerRef.current.style.height = height + "px";

            //if from some reason it keeps looping - exit
            cycles++;
            if (cycles > 10)
                clearInterval(inter)
        }
        inter = setInterval(update, 500)
        return () => clearInterval(inter)
    }, [isLoading, updateSize])


    const [creatingOrder, setCreatingOrder] = useState(false)

    //create order from server logic
    const createOrder = genOrder(toggleSize, setCreatingOrder)
    const onApprove = genApprove()
    const onCancel = genOnCancel(containerRef);

    function preventClose(e) {
        e.preventDefault();
        return true
    }
    function removeCloseEvent() { window.removeEventListener("beforeunload", preventClose) }

    useEffect(() => {
        window.addEventListener("beforeunload", preventClose)
        return removeCloseEvent // remove when dismounting
    }, [])


    //https://paypal.github.io/react-paypal-js/?path=/story/example-paypalbuttons--default&args=showSpinner:true
    return (
        <Box m={"auto"} minH="5em" zIndex={0} style={{ colorScheme: "light" }} bg="white" position={"relative"} borderRadius={"3em 3em 0 0"}
            w={"inherit"} p={"1em"} pb={0} {...props} borderTop={"0.7em solid"} borderColor={"high.purple"}>
            <Box display={["block", "none"][~~isLoading]} overflow={"hidden"} h={"5em"} ref={containerRef} transition={"0.2s linear"}>
                {props.children}
                <Box display={["block", "none"][~~creatingOrder]}>
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
            </Box>
            {(isLoading || creatingOrder) && <Loader />}
        </Box>
    )
}


/**
 * sends the server the current cart - server communicate with PayPal and returns order controls from PayPal
 * @returns 
 */
function genOrder(updateSize, setCreatingOrder) {
    const toast = useToast()
    const { cartItems, resetCart } = useContext(CartContext)
    const { SERVER } = useContext(AuthContext)

    return async function createOrder(data, actions) {
        setCreatingOrder(true)
        try {
            //send the cart items to the server - then the server calls paypal and creates the order itself so users cant(easily) edit it at their side
            const res = await axios.post(`${SERVER}orders/api/create`, { cart: cartItems }, { withCredentials: true })
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
            if (e?.response?.data?.noCart) {
                toastError(new Error("לא היה ניתן לבצע הזמנה כי אין מוצרים בסל"), toast)
            } else if (e?.response?.data?.cartChanged) {
                /** @type {CartItem[]} */
                resetCart();
            }
            toastError(e, toast);
        } finally {
            updateSize(true);
            setCreatingOrder(false)
        }
    }
}

function genApprove() {
    const toast = useToast()
    const { resetCart, OpenCart } = useContext(CartContext);
    const { SERVER } = useContext(AuthContext);
    const queryClient = useQueryClient();

    return async function (data, actions) {
        try {
            const response = await axios.post(`${SERVER}orders/api/${data.orderID}/capture`, { withCredentials: true })
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

            const { orderID } = orderData;

            resetCart(); //reset cart
            OpenCart(false);
            queryClient.invalidateQueries([`getOrders`])
            if (orderID)
                setTimeout(() => {
                    window.location = `/order/${orderID}`;
                }, 2000)
        } catch (e) {
            toastError(e, toast);
        }
    }

}

function genOnCancel(containerRef) {
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
        finally {
            containerRef.current.style.height = "auto"
        }
    }
}

function onError(data, actions) {
    console.warn("error", data, actions)
}
export default BuyButton
