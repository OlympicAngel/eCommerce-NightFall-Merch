import { AiFillEye } from "react-icons/ai";
import { Button, Flex, HStack, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import UserFullview from "./UserFullview"
import { AiOutlineEdit } from "react-icons/ai"
import { useParams, useSearchParams } from "react-router-dom";

function UserTable({ users = [], colorScheme = "purple", setEditUser }) {
    const [showUser, setShowUser] = useState()

    return (<>
        <TableContainer>
            <Table variant='striped' colorScheme={colorScheme} size={["xs", "xs", "sm", "md", "lg"]}>
                <Thead><HeaderCategories /></Thead>
                <Tbody>{users.map(u => <UserRow key={u._id} user={u} setShowUser={setShowUser} setEditUser={setEditUser} />)}</Tbody>
                <Tfoot><HeaderCategories /></Tfoot>
            </Table>
        </TableContainer>
        {showUser && <UserFullview userID={showUser?._id} close={setShowUser} />}
    </>
    )
}

function HeaderCategories() {
    return <Tr>
        <Th>שם פרטי</Th>
        <Th display={["none", "table-cell"]}>אמייל</Th>
        <Th>טלפון</Th>
        <Th>כתובת</Th>
        <Th>הזמנות</Th>
        <Th ></Th>
    </Tr>
}

function UserRow({ user, setShowUser, setEditUser }) {

    return <Tr>
        <Td maxW={"15vw"} textOverflow={"ellipsis"} overflow={"hidden"}  >{user.name}</Td>
        <Td maxW={"15vw"} textOverflow={"ellipsis"} overflow={"hidden"} style={{ direction: "ltr" }} display={["none", "table-cell"]}>{user.email}</Td>
        <Td>{user.phone}</Td>
        <Td maxW={"15vw"} textOverflow={"ellipsis"} overflow={"hidden"}>{user.address.city}</Td>
        <Td textAlign="center">x {user.orders.length}</Td>
        <Td>
            <Flex gap={["0.5em", "1em"]}>
                <Button px={["0.3em", "1em"]} colorScheme="orange" onClick={() => { setEditUser(user) }} >
                    <AiOutlineEdit />
                </Button>
                <Button px={["0.3em", "1em"]} as={HStack} bg="gray.900" color={"gray.100"} _hover={{ bg: "gray.700" }}
                    onClick={() => { setShowUser(user) }}>
                    <AiFillEye />
                </Button>
            </Flex>
        </Td>
    </Tr>
}

export default UserTable