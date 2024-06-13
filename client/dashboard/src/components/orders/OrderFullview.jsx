import { AiOutlineLink } from "react-icons/ai";
import { FaCcPaypal } from "react-icons/fa";
import { RiPaypalFill } from "react-icons/ri";
import { Badge, Box, Button, Divider, Flex, HStack, Heading, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Dialog from "../partial/Dialog";
import { useEffect, useState } from "react";
import useMutationLogic from "../../hooks/useMutationLogic";
import UserFullview from "../users/normal/UserFullview";
import DynTable from "../partial/DynTable";



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
            <Box as={Flex} gap={5} flexDir={["column", "column", "column", "column", "row"]} flexWrap={"wrap"} >
                <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={"1 0 45%"} maxW={"100%"}>
                    <Heading ms={5} as={Flex} size='lg'>
                        פרטי קונה:
                        <Spacer />
                        {order.user &&
                            order.user._id && <Button me={"0.5em"} colorScheme="green" onClick={() => { setUser2View(order.user); onClose() }}>הצג משתמש</Button>}
                    </Heading>
                    <DynTable>
                        <Thead >
                            <Tr>
                                <Th>שם</Th>
                                <Th>טלפון</Th>
                                <Th>עיר</Th>
                                <Th>כתובת</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr background={"blackAlpha.300"}>
                                <Td whiteSpace="nowrap">{customer.name}</Td>
                                <Td>{customer.phone}</Td>
                                <Td>{customer.address.city}</Td>
                                <Td>{customer.address.street} {customer.building}</Td>
                            </Tr>
                        </Tbody>
                    </DynTable>
                </Box>

                <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={"1 0 45%"} maxW={"100%"}>
                    <Heading ms={5} as='h2' size='lg' noOfLines={1}>
                        <HStack>
                            <FaCcPaypal size={"1.5em"} color="dodgerblue" />
                            <Text>פרטי עסקה:</Text>
                        </HStack>
                    </Heading>
                    <DynTable>
                        <Thead>
                            <Tr>
                                <Th>מזהה פעולה</Th>
                                <Th>תאריך</Th>
                                <Th>מזהה קנייה</Th>
                                <Th>עמלות(פאיפל)</Th>
                            </Tr>
                        </Thead>
                        <Tbody >
                            <Tr background={"blackAlpha.300"} >
                                <Td p="0 !important" color={"blue.400"} textAlign={"center"}><a target="_black" style={{ whiteSpace: "nowrap" }}
                                    href={`https://www${import.meta.env.DEV ? ".sandbox" : ""}.paypal.com/activity/payment/${order.payment.transaction_number}`}>
                                    <AiOutlineLink />{payment.transaction_number}
                                </a> <Text fontSize={"0.75em"} color="gray.500">- פתח עסקה בפאיפל -</Text></Td>
                                <Td>{new Date(payment.date).toLocaleString("he-il", { "dateStyle": "medium", "timeStyle": "short" })}</Td>
                                <Td p="0 !important">{payment.paypal_id}</Td>
                                <Td >
                                    <Badge colorScheme="red" variant={"solid"} h="1.2em" w={"100%"} fontSize={"1.2em"} textAlign={"center"}>
                                        <strong>₪{payment.paypal_fee?.toLocaleString()}-</strong>
                                    </Badge>
                                </Td>
                            </Tr>
                        </Tbody>
                    </DynTable>
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