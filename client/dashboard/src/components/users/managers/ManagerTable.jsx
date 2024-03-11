import { FaLevelUpAlt } from "react-icons/fa";
import { Badge, Button, Flex, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { ManagerBadge } from "../../partial/LoggedAdminFooter";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { ManagerDialog } from "./Managers";
import { AiOutlineEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import useMutationLogic from "../../../hooks/useMutationLogic";

function ManagerTable({ managers = [], colorScheme = "purple" }) {
    const loggedManager = useContext(AuthContext).manager;

    //delete logic
    const deleteManager = useMutationLogic({
        urlPath: (manager) => `users/managers/${manager._id}`,
        method: "delete",
        relatedQuery: "managers"
    })

    //promote logic
    const promote2Admin = useMutationLogic({
        urlPath: (manager) => `users/managers/${manager._id}`,
        method: "put",
        data: { permission: 2 },
        relatedQuery: "managers"
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
    const isYou = manager._id == loggedManager._id
    return <>
        <Tr>
            <Td>
                {isYou && <Badge colorScheme="green">אתה</Badge>} {manager.name}
            </Td>
            <Td>{manager.email}</Td>
            <Td><ManagerBadge manager={manager}></ManagerBadge></Td>
            {loggedManager.permission == 2 && <Td>
                <Flex gap={"1em"}>
                    {isYou &&
                        <Button colorScheme="orange" onClick={setOpenManagerDialog.bind(null, true)}><AiOutlineEdit /> עדכן</Button> ||
                        <Button colorScheme="green" onClick={() => { promote(manager) }}><FaLevelUpAlt /> קדם לאדמין</Button>
                    }

                    <Button colorScheme="red" isDisabled={isYou} text="df" onClick={() => { deleteManager(manager) }}><BsFillTrashFill /> מחק</Button>
                </Flex>
                <ManagerDialog open={openManagerDialog} manager={manager} setClose={setOpenManagerDialog}></ManagerDialog>
            </Td>}
        </Tr>
    </>
}

export default ManagerTable