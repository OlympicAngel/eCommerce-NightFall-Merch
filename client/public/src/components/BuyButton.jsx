import { PayPalButtons } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react"
import { Box } from "@chakra-ui/react";


function BuyButton({ items }) {

    const [paypalItems, setPaypalItems] = useState()
    //create array of items as paypal wants it
    useEffect(() => {
        if (!items)
            return;
        /** Example of item
         * {
                product: product._id,
                quantity: 1,
                ref: product
            }
         */
        const convertedItems = items.map(i => ({
            name: i.product.name,
            quantity: i.quantity,
            unit_amount: {
                currency_code: "ILS",
                value: i.quantity * i.product.price,
            }
        }))
        setPaypalItems(convertedItems, "הזמנה מחנות המרצ' של נייטפול");
    }, [items])

    const createOrder = genOrder(paypalItems)
    //https://paypal.github.io/react-paypal-js/?path=/story/example-paypalbuttons--default&args=showSpinner:true
    return (
        <Box m={"0.5em auto"} textAlign={"center"} style={{ colorScheme: "light" }} bg="paypalBG" p="1em" pb="0" borderRadius={"0.4em"}
            border="solid 0.15em" borderColor="orange.300" boxShadow={"dark-lg"} w={"inherit"} maxW={"min(100%,600px)"}>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                onCancel={onCancel}
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
    )
}

function genOrder(items, description) {
    return function createOrder(data, actions) {
        const totalSum = items?.reduce((pre, i) => pre + i.unit_amount.value, 0) || 0.01;
        return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
                {
                    description,
                    items,
                    amount: {
                        currency_code: "ILS",
                        value: totalSum, //TODO total
                        breakdown: {
                            item_total: {
                                currency_code: "ILS",
                                value: totalSum, //TODO total
                            }
                        }
                    }
                }
            ]
        })
    }
}

async function onApprove(data, actions) {
    const order = await actions.order()
}

function onCancel(data, actions) {

}

function onError(data, actions) {

}
export default BuyButton