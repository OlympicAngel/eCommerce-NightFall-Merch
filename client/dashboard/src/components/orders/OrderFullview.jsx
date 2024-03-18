import { Box, Button, Divider, Flex, Heading, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react"
import Dialog from "../partial/Dialog"
import { useEffect, useState } from "react"
import useMutationLogic from "../../hooks/useMutationLogic"
import { useNavigate } from "react-router-dom";
import UserFullview from "../users/normal/UserFullview";



function OrderFullview({ order, handleClose }) {
    //delete method
    const deleteOrder = useMutationLogic({
        "method": "delete",
        "onSuccess": () => { handleClose && handleClose() },
        "relatedQuery": "orders",
        "urlPath": `orders/manage/${order?._id}`
    })

    const [user2View, setUser2View] = useState()

    //simplified object access
    const payment = order?.payment, customer = order?.customer

    //model controller
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closer = () => { onClose(); handleClose(); }
    //open when we get an order
    useEffect(() => {
        if (order)
            onOpen();
    }, [order])

    if (!order)
        return;

    const header = <Text display={"inline-block"}>פרטי הזמנה: {order?._id}</Text>;
    return (<>
        <Dialog {...{ isOpen, onOpen, onClose: closer, config: { w: "80vw", cancel: null, action: "סגור", header } }} >
            <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2}>
                <Heading ms={5} as='h1' size='lg' noOfLines={1}>מוצרים:</Heading>
                <TableContainer>
                    <Table variant='striped' colorScheme='purple' size={["sm", "md", "lg"]}>
                        <Thead>
                            <Tr>
                                <Th>מוצר</Th>
                                <Th isNumeric>מחיר</Th>
                                <Th isNumeric>כמות</Th>
                                <Th isNumeric>סה"כ</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {order.products.map(p => <Tr key={p._id}>
                                <Td>{p.product?.name || "-הוסר-"}</Td>
                                <Td isNumeric>₪{p.RTP.toLocaleString()}</Td>
                                <Td isNumeric>x{p.quantity.toLocaleString()}</Td>
                                <Td isNumeric>₪{(p.quantity * p.RTP).toLocaleString()}</Td>
                            </Tr>)}
                        </Tbody>
                    </Table>
                    <Box fontWeight={700} mt={2} me={5} fontSize={"lg"} textAlign={"end"}>
                        סכום הזמנה: ₪{order.products.reduce((a, p) => a + p.quantity * p.RTP, 0).toLocaleString()}
                    </Box>
                </TableContainer>
            </Box>
            <Divider mt={5} mb={5}></Divider>
            <Box as={Flex} gap={5} flexDir={["column", "column", "column", "column", "row"]}>
                <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={1}>
                    <Heading ms={5} as={Flex} size='lg'>
                        פרטי קונה:
                        <Spacer />
                        {order.user &&
                            order.user._id && <Button me={"0.5em"} colorScheme="green" onClick={() => { setUser2View(order.user); onClose() }}>הצג משתמש</Button>}
                    </Heading>
                    <Table size={["sm", "md", "lg"]}>
                        <Thead>
                            <Tr>
                                <Th>שם</Th>
                                <Th>טלפון</Th>
                                <Th>עיר</Th>
                                <Th>כתובת</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr background={"gray.600"}>
                                <Td>{customer.name}</Td>
                                <Td>{customer.phone}</Td>
                                <Td>{customer.address.city}</Td>
                                <Td>{customer.address.street} {customer.building}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>

                <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={1}>
                    <Heading ms={5} as='h2' size='lg' noOfLines={1}>פרטי עסקה:</Heading>
                    <Table size={["sm", "md", "lg"]}>
                        <Thead>
                            <Tr>
                                <Th>מס' עסקה</Th>
                                <Th>תאריך</Th>
                                <Th>מס' מסוף</Th>
                                <Th>אמצעי תשלום</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr background={"gray.600"}>
                                <Td>{payment.transaction_number}</Td>
                                <Td>{new Date(payment.date).toLocaleString("he-il", { "dateStyle": "medium", "timeStyle": "short" })}</Td>
                                <Td>{payment.paypal_id}</Td>
                                <Td>XXXX-XXXX-{payment.last_digits}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </Box>
            <Button onClick={() => deleteOrder.mutate()} mt="5" p={"0.2em 1em"} h={"auto"} colorScheme="red"
                bg={"red.500"} color={"orange.100"} fontSize={"1em"} isLoading={deleteOrder.isLoading}>מחק הזמנה</Button>
        </Dialog>
        {user2View && <UserFullview userID={user2View?._id} close={() => { setUser2View(); onOpen() }}></UserFullview>}
    </>
    )
}
export default OrderFullview