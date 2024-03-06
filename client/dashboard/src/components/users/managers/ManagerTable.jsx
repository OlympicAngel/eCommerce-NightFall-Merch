import { Badge, Button, Flex, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useStatStyles, useToast } from "@chakra-ui/react"
import { ManagerBadge } from "../../partial/LoggedAdminFooter"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/AuthProvider"
import Dialog from "../../partial/Dialog"
import { ManagerDialog } from "./ManagerUsers"
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"
import { toastError, toastSuccess } from "../../../utils/toast.helper"

function ManagerTable({ managers = [], colorScheme = "purple" }) {
    const loggedManager = useContext(AuthContext).manager;

    const toast = useToast()
    const { SERVER } = useContext(AuthContext)
    const queryClient = useQueryClient()

    //delete logic
    const deleteManager = useMutation({
        mutationFn: async (manager) => axios({
            "url": `${SERVER}users/managers/${manager._id}`,
            method: "delete",
            "withCredentials": true
        }),
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getManagers")
        }
    })

    //promote logic
    const promote2Admin = useMutation({
        mutationFn: async (manager) => axios({
            "url": `${SERVER}users/managers/${manager._id}`,
            method: "put",
            data: { permission: 2 },
            "withCredentials": true
        }),
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getManagers")
        }
    })

    return (<>
        <TableContainer>
            <Table variant='striped' colorScheme={colorScheme} size={["sm", "md", "lg"]}>
                <Thead><Tr><HeaderCategories loggedManager={loggedManager} /></Tr></Thead>
                <Tbody>
                    {managers.map(m =>
                        <ManagerRow key={m._id} manager={m} loggedManager={loggedManager}
                            deleteManager={deleteManager.mutate} promote={promote2Admin.mutate} />)}
                </Tbody>
                <Tfoot><Tr><HeaderCategories loggedManager={loggedManager} /></Tr></Tfoot>
            </Table>
        </TableContainer>
    </>
    )
}

function HeaderCategories({ loggedManager }) {
    return <>
        <Th>שם פרטי</Th>
        <Th>אמייל</Th>
        <Th>הרשאה</Th>
        {loggedManager.permission == 2 && <Th></Th>}
    </>
}

function ManagerRow({ manager, loggedManager, deleteManager, promote }) {
    //opener for edit/post
    const [openManagerDialog, setOpenManagerDialog] = useState(false)

    return <>
        <Tr>
            <Td>
                {manager._id == loggedManager._id && <Badge colorScheme="green">אתה</Badge>} {manager.name}
            </Td>
            <Td>{manager.email}</Td>
            <Td><ManagerBadge manager={manager}></ManagerBadge></Td>
            {loggedManager.permission == 2 && <Td>
                <Flex gap={"1em"}>
                    {manager._id == loggedManager._id && <Button colorScheme="orange" onClick={setOpenManagerDialog.bind(null, true)}>עדכן</Button>}
                    <Button colorScheme="green" isDisabled={manager.permission != 1} onClick={() => { promote(manager) }}>קדם לאדמין</Button>
                    <Button colorScheme="red" isDisabled={manager._id == loggedManager._id} text="df" onClick={() => { deleteManager(manager) }}>מחק</Button>
                </Flex>
                <ManagerDialog open={openManagerDialog} manager={manager} setClose={setOpenManagerDialog}></ManagerDialog>
            </Td>}
        </Tr>
    </>
}

export default ManagerTable