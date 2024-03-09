import { BsArrowsFullscreen } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
import { Box, Button, Flex, HStack, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Dialog from "../../partial/Dialog";
import { useEffect, useState } from "react";
import useMutationLogic from "../../../hooks/useMutationLogic";
import { orderStatusSteps } from "../../orders/OrderStatus";
import OrderFullview from "../../orders/OrderFullview";
import useQueryLogic from "../../../hooks/useQueryLogic";
import Loader from "../../partial/Loader";

function UserFullview({ userID, close }) {
    if (!userID)
        throw new Error("Please provide an {userID} prop! if its null please make sure to not load it until its valid.")

    //load user data
    const getUserByID = useQueryLogic({
        "key": "user" + userID,
        "urlPath": "users/manage/" + userID,
        "select": (res) => res.data.user
    })
    const user = getUserByID.data;

    const { isOpen, onOpen, onClose } = useDisclosure({})
    useEffect(() => { onOpen() }, [])

    //when prompt close remove user
    const handleClose = () => { onClose(); close && close(); }

    const deleteUser = useMutationLogic({
        "method": "delete",
        "relatedQuery": "users",
        "urlPath": "users/manage/" + userID,
        onSuccess: handleClose
    })

    const [order2Fullview, setOrder2Fullview] = useState()


    const config = {
        w: "80vw",
        header: <HeaderMenu {...{ user, deleteUser }} />,
        cancel: "",
        action: "חזור",
        onConfirm: null,
        isLoading: deleteUser.isLoading
    }
    return (
        <>
            <Dialog {...{ isOpen, onOpen, onClose: handleClose, config }}>
                {getUserByID.isLoading &&
                    <Loader /> ||
                    <Box as={Flex} gap={5} flexDir={"column"}>
                        <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={1}>
                            <Heading ms={5} as='h2' size='lg' noOfLines={1}>פרטי משתמש:</Heading>
                            <Flex w={"100%"} justifyContent={"space-between"} gap="0.5em 1em" fontSize={["xs", "sm", "md"]}
                                wrap={"wrap"} textAlign={"center"} px={"0.5em"} bg="gray.800">
                                <Box flex="1 0 10vw">
                                    <Heading fontSize="1.5em" color="gray.400" >שם</Heading>
                                    <Text whiteSpace={"nowrap"}>{user.name}</Text>
                                </Box>
                                <Box flex="1 0 10vw" >
                                    <Heading fontSize="1.5em" color="gray.400">טלפון</Heading>
                                    <Text>{user.phone}</Text>
                                </Box>
                                <Box flex="1 0 10vw">
                                    <Heading fontSize="1.5em" color="gray.400">אמייל</Heading>
                                    <Text>{user.email}</Text>
                                </Box>
                                <Box flex="1 0 10vw">
                                    <Heading fontSize="1.5em" color="gray.400">עיר</Heading>
                                    <Text>{user.address.city}</Text>
                                </Box>
                                <Box flex="1 0 10vw">
                                    <Heading fontSize="1.5em" color="gray.400">כתובת</Heading>
                                    <Text whiteSpace={"nowrap"}>{user.address.street} {user.address.building}</Text>
                                </Box>
                            </Flex>
                        </Box>
                        <Box shadow={"xl"} borderWidth='1px' borderRadius='lg' pt={2} pb={2} flex={1}>
                            <Heading ms={5} as='h2' size='lg' noOfLines={1}>הזמנות:</Heading>
                            <TableContainer>
                                <Table variant='striped' colorScheme='purple'>
                                    <Thead>
                                        <Tr>
                                            <Th></Th>
                                            <Th>סכום</Th>
                                            <Th>תאריך</Th>
                                            <Th>כמות מוצרים</Th>
                                            <Th>סטטוס</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {user.orders.map(({ order }) => <OrderRow key={order._id} {...{ order, setOrder2Fullview, onClose }}></OrderRow>)}
                                    </Tbody>
                                </Table>
                                {user.orders.length == 0 && <Text w={"100%"} color="gray.500" textAlign={"center"}>~ משתמש זה עדיין לא ביצע הזמנות ~</Text>}

                            </TableContainer>
                        </Box>
                    </Box>
                }
            </Dialog>
            <OrderFullview {...{ order: order2Fullview, handleClose: () => { onOpen(); setOrder2Fullview(); } }}></OrderFullview>
        </>
    )
}

function HeaderMenu({ user, deleteUser }) {

    return <HStack flexDir={["column", "row"]}>
        <Box>
            תצוגת משתמש - {user?._id || "- - -"}
        </Box>
        <Spacer></Spacer>

        <Menu placement={"bottom"} boxShadow="md">
            <MenuButton as={Button} minW={"fit-content"} colorScheme="red" leftIcon={<BsFillTrashFill />} isLoading={deleteUser.isLoading} >
                מחק משתמש
            </MenuButton>
            <MenuList minW={"auto"} boxShadow="dark-lg">
                <Heading size={"md"} color="red.500" px={"0.5em"}>למחוק לצמיתות?</Heading>
                <MenuDivider />
                <MenuItem bg="red.800" color="red.50" justifyContent={"center"}
                    _hover={{ background: "red.900" }} onClick={async () => deleteUser.mutate()}>מחק</MenuItem>
                <MenuItem justifyContent={"center"}>ביטול</MenuItem>
            </MenuList>
        </Menu>
    </HStack>
}

function OrderRow({ order, setOrder2Fullview, onClose }) {
    return <>
        <Tr>
            <Td p="0 !important" pr={"0.5em !important"}>
                <Button colorScheme="green" onClick={() => { setOrder2Fullview(order); onClose() }}><BsArrowsFullscreen size={"1.5em"} /></Button>
            </Td>
            <Td>₪{order.total_price.toLocaleString()}</Td>
            <Td>{new Date(order.created_at).toLocaleDateString("he-il", { "hour": "2-digit", "minute": "2-digit" })}</Td>
            <Td>{order.products.reduce((sum, p) => sum + p.quantity || 0, 0).toLocaleString()}</Td>
            <Td>{orderStatusSteps[order.status].title}</Td>
        </Tr>
    </>
}

export default UserFullview