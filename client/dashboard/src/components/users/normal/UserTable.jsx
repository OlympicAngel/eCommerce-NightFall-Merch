import { Button, Flex, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import UserFullview from "./UserFullview"

function UserTable({ users = [], colorScheme = "purple" }) {
    const [showUser, setShowUser] = useState()

    return (<>
        <TableContainer>
            <Table variant='striped' colorScheme={colorScheme} size={["xs", "xs", "sm", "md", "lg"]}>
                <Thead><HeaderCategories /></Thead>
                <Tbody>{users.map(u => <UserRow key={u._id} user={u} setShowUser={setShowUser} />)}</Tbody>
                <Tfoot><HeaderCategories /></Tfoot>
            </Table>
        </TableContainer>
        <UserFullview user={showUser} close={setShowUser} />
    </>
    )
}

function HeaderCategories() {
    return <Tr>
        <Th>שם פרטי</Th>
        <Th display={["none", "table-cell"]}>אמייל</Th>
        <Th>טלפון</Th>
        <Th>כתובת</Th>
        <Th >כמות</Th>
        <Th >בזבז</Th>
        <Th ></Th>
    </Tr>
}

function UserRow({ user, setShowUser }) {
    return <Tr>
        <Td>{user.name}</Td>
        <Td display={["none", "table-cell"]}>{user.email}</Td>
        <Td>{user.phone}</Td>
        <Td>{user.address.city}</Td>
        <Td textAlign="center">x {user.orders.length}</Td>
        <Td textAlign="center">
            ₪{user.orders.reduce((pre, o) => pre + o.total_price, 0)}
        </Td>
        <Td>
            <Flex gap="1em">
                <Button colorScheme="orange">עדכן</Button>
                <Button bg="gray.900" color={"gray.100"} _hover={{ bg: "gray.700" }} onClick={() => { setShowUser(user) }}>הצג</Button>
            </Flex>
        </Td>
    </Tr>
}

export default UserTable