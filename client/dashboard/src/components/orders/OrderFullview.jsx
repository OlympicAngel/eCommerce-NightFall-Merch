import { Box, Button, Card, Divider, Flex, Heading, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react"
import Dialog from "../partial/Dialog"
import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { AuthContext } from "../../context/AuthProvider"
import { toastError, toastSuccess } from "../../utils/toast.helper"



function OrderFullview({ order, setFullview }) {
    //delete method
    const { SERVER } = useContext(AuthContext)
    const toast = useToast();
    const queryClient = useQueryClient()
    const deleteOrder = useMutation({
        mutationFn: async (id) => axios.delete(`${SERVER}orders/manage/${id}`, { "withCredentials": true }),
        onError: (e) => { toastError(e, toast) },
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getOrders")
            setFullview()//close dialog
        }
    })


    //simplified object access
    const payment = order?.payment_details, customer = order?.customer_details

    //model controller
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closer = () => {
        onClose();
        setFullview();
    }
    //open when we get an order
    useEffect(() => {
        if (order)
            onOpen();
    }, [order])

    if (!order)
        return;

    const header = <Heading as='h1' display={"inline-block"}>פרטי הזמנה: {order?._id}</Heading>;
    return (
        <Dialog {...{ isOpen, onOpen, onClose: closer, config: { w: "80vw", onConfirm: console.log, cancel: null, action: "סגור", header } }} >
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
                                <Td isNumeric>{p.RTP.toLocaleString()}</Td>
                                <Td isNumeric>x{p.quantity.toLocaleString()}</Td>
                                <Td isNumeric>{(p.quantity * p.RTP).toLocaleString()}</Td>
                            </Tr>)}
                        </Tbody>
                    </Table>
                    <Box fontWeight={700} mt={2} me={5} fontSize={"lg"} textAlign={"end"}>
                        סכום הזמנה: {order.products.reduce((a, p) => a + p.quantity * p.RTP, 0).toLocaleString()}
                    </Box>
                </TableContainer>
            </Box>
            <Divider mt={5} mb={5}></Divider>
            <Box as={Flex} gap={5} flexDir={["column", "column", "column", "column", "row"]}>
                <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={1}>
                    <Heading ms={5} as='h2' size='lg' noOfLines={1}>פרטי קונה:</Heading>
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
                                <Td>{customer.customer_name}</Td>
                                <Td>{customer.customer_phone}</Td>
                                <Td>{customer.customer_address.city}</Td>
                                <Td>{customer.customer_address.street} {customer.customer_address.building}</Td>
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
                                <Td>{new Date(payment.transaction_date).toLocaleString("he-il", { "dateStyle": "medium", "timeStyle": "short" })}</Td>
                                <Td>{payment.terminal_number}</Td>
                                <Td>XXXX-XXXX-{payment.last_digits}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </Box>
            <Button onClick={() => deleteOrder.mutate(order._id)} mt="5" p={"0.2em 1em"} h={"auto"} colorScheme="red" bg={"red.500"} color={"orange.100"} fontSize={"1em"}>מחק הזמנה</Button>
        </Dialog>
    )
}
export default OrderFullview