import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import HeaderCRUD from "../partial/HeaderCRUD";
import Dialog from "../partial/Dialog";
import CategoryForm from "../forms/CategoryForm";
import { useState } from "react";
import Loader from "../partial/Loader";
import useMutationLogic from "../../hooks/useMutationLogic";

function CategoriesTable({ categories = [], isLoading }) {
    //dialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [category2edit, setCategory2edit] = useState();

    //delete
    const deleteDialog = useDisclosure();
    const [category2delete, setCategory2delete] = useState();
    const deleteLogic = useMutationLogic({ "urlPath": (id) => `categories/${id}`, "method": "delete", "relatedQuery": "categories" })

    return (<>
        <HeaderCRUD name="קטגוריות" list={categories} onAdd={() => { onOpen(); }} />
        {isLoading &&
            <Loader /> ||
            <TableContainer>
                <Table variant='simple' width="min-content" margin={"auto"}>
                    <Thead>
                        <Tr>
                            <Th>שם קטגוריה</Th>
                            <Th>צבע</Th>
                            <Th>פעולות</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {categories.map(c =>
                            <Tr key={c._id}>
                                <Td fontSize={"1.5em"}>{c.name}</Td>
                                <Td><Box borderRadius="full" bg={c.color + ".500"} w={"1em"} aspectRatio={1}></Box></Td>
                                <Td>
                                    <Flex gap="1em">
                                        <Button colorScheme="green" onClick={() => { setCategory2edit(c); onOpen(); }}>עדכן</Button>
                                        <Button colorScheme="red" bg="red.500" onClick={() => { setCategory2delete(c._id); deleteDialog.onOpen() }} > מחק</Button>
                                    </Flex>
                                </Td>
                            </Tr>)}
                    </Tbody>
                </Table>
            </TableContainer>
        }
        <Dialog {...{ isOpen, onOpen, onClose }} config={{ hasForm: true }}>
            <CategoryForm onClose={() => { onClose(); setCategory2edit(); }} category={category2edit}></CategoryForm>
        </Dialog>
        <DeletePrompt isLoading={deleteLogic.isLoading} onConfirm={() => { deleteLogic.mutate(category2delete) }}
            {...{ isOpen: deleteDialog.isOpen, onOpen: deleteDialog.onOpen, onClose: deleteDialog.onClose }} />
    </>
    )
}
export default CategoriesTable

function DeletePrompt({ onConfirm, isLoading, isOpen, onOpen, onClose }) {
    const cfg = {
        header: "מחיקת קטגוריה?",
        content: "אתה עומד למחוק קטגוריה זו לצימות, בטוח שזו הפעולה שאתה רוצה?",
        action: "מחק!",
        confirmColor: "red.500",
        onConfirm,
        isLoading
    };

    return <Dialog {...{ isOpen, onOpen, onClose }} config={cfg}>{cfg.content}</Dialog>
}