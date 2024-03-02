import { Button, Flex, HStack, Heading, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from "@chakra-ui/react"
import ConvertToExcel from "../../utils/toExcel";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiFillPlusCircle } from "react-icons/ai";
import HeaderCRUD from "../partial/HeaderCRUD";
import Dialog from "../partial/Dialog";
import CategoryForm from "../forms/CategoryForm";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toastError, toastSuccess } from "../../utils/toast.helper";

function CategoriesTable({ categories = [] }) {

    //dialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [category2edit, setCategory2edit] = useState();

    //delete
    const deleteDialog = useDisclosure();
    const [category2delete, setCategory2delete] = useState();
    const toast = useToast()
    const { SERVER } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const categoryCRUD = useMutation({
        mutationFn: async (id) => axios({
            "url": `${SERVER}categories/${id}`,
            method: "delete",
            "withCredentials": true
        }),
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);
            queryClient.invalidateQueries("getCategories")
        }
    })
    const { isLoading } = categoryCRUD;

    return (<>
        <HeaderCRUD name="קטגוריות" list={categories} onAdd={() => { onOpen(); }} />

        <TableContainer>
            <Table variant='simple' width="min-content" margin={"auto"}>
                <Thead>
                    <Tr>
                        <Th>שם קטגוריה</Th>
                        <Th>פעולות</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {categories.map(c =>
                        <Tr key={c._id}>
                            <Td fontSize={"1.5em"}>{c.name}</Td>
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

        <Dialog {...{ isOpen, onOpen, onClose }} config={{ hasForm: true }}>
            <CategoryForm onClose={() => { onClose(); setCategory2edit(); }} category={category2edit}></CategoryForm>
        </Dialog>
        <DeletePrompt isLoading={isLoading} onConfirm={async () => { return await categoryCRUD.mutate(category2delete) }}  {...{ isOpen: deleteDialog.isOpen, onOpen: deleteDialog.onOpen, onClose: deleteDialog.onClose }} />
    </>
    )
}
export default CategoriesTable

function DeletePrompt({ onConfirm, isLoading, isOpen, onOpen, onClose }) {
    const cfg = {
        header: "מחיקת קטגוריה?",
        content: "אתה עומד למחוק קטגוריה זה לצימות, בטוח שזו הפעולה שאתה רוצה?",
        action: "מחק!",
        confirmColor: "red.500",
        onConfirm,
        isLoading
    };

    return <Dialog {...{ isOpen, onOpen, onClose }} config={cfg}>{cfg.content}</Dialog>
}