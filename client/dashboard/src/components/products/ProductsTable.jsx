import { FaShekelSign } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { IoMdOptions } from "react-icons/io";
import { BiChevronDown } from "react-icons/bi";
import { TableContainer, Table, Menu, Thead, Tr, Th, Button, MenuButton, Tbody, Td, MenuItem, Tooltip, Heading, MenuList, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Image, Text, HStack, Container, Flex, Box, useToast, Skeleton, Badge } from "@chakra-ui/react"
import { useContext, useState } from "react";
import Dialog from "../partial/Dialog";
import ProductForm from "../forms/ProductForm";
import { AuthContext } from "../../context/AuthProvider";
import convertToExcel from "../../utils/toExcel"
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toastSuccess } from "../../utils/toast.helper";
import HeaderCRUD from "../partial/HeaderCRUD";
import CategoryBadge from "../categories/CategoryBadge";
import useCategories from "../../hooks/useGetCategories";


function ProductsTable({ products = [] }) {
    const { SERVER } = useContext(AuthContext)
    const API = SERVER + "products";

    const categories = useCategories();


    //set actions options for products
    const [userAction, setUserAction] = useState({ action: null, product: null });
    //handlers for dialog logic
    const { isOpen, onOpen, onClose } = useDisclosure();

    //delete toast handler
    const toast = useToast();
    //delete logic
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        "mutationFn": async (product) => await axios({ "url": `${API}/${product._id}`, "method": "delete" }),
        "onSuccess": (res, product) => {
            queryClient.invalidateQueries("getProducts");
            toastSuccess(res.data.message, toast)
        },
        "onError": (e) => toastError(e, toast)
    })
    const isDeleting = deleteMutation.isLoading;

    //handle user option that uses Dialog module
    let promptConfig = {};
    //for any action needed for an confirmation
    switch (userAction.action) {
        case "delete":
            promptConfig = {
                header: "מחיקת מוצר?",
                content: "אתה עומד למחוק מוצר זה לצימות, בטוח שזו הפעולה שאתה רוצה?",
                action: "מחק!",
                confirmColor: "red.500",
                onConfirm: () => { deleteMutation.mutate(userAction.product) },
                isLoading: isDeleting
            }
            break;
        case "add":
            promptConfig = {
                header: "הוספת מוצר:",
                content:
                    <ProductForm closeDialog={onClose} btnText={<HStack><AiFillPlusCircle /><Text>הוסף!</Text></HStack>}>
                    </ProductForm>,
                hasForm: true
            }
            break;
        case "update":
            const { product } = userAction;
            promptConfig = {
                header: "עדכון מוצר:",
                content:
                    <ProductForm closeDialog={onClose} {...{ product }} method="put" btnText={<HStack><AiOutlineEdit /><Text>ערוך!</Text></HStack>}>
                    </ProductForm>,
                hasForm: true
            }
            break;
    }

    return (
        <>
            <TableContainer w="100%">
                <HeaderCRUD name="מוצרים" list={products} onAdd={() => {
                    setUserAction({ action: "add" });
                    onOpen()
                }} />

                <Table variant='simple' colorScheme='purple' w="100%">
                    <Thead>
                        <Tr>
                            <Th display={["none", "none", "table-cell"]} w={"20"}></Th>
                            <Th>שם המוצר</Th>
                            <Th>מחיר</Th>
                            <Th display={["none", "table-cell"]}>קטגוריה</Th>
                            <Th>פעולות</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.map(p => <ProductRow key={p._id || Math.random()} {...{ p, setUserAction, onOpen, categories }} />)}
                    </Tbody>
                </Table>
            </TableContainer>
            <Dialog isOpen={isOpen} onOpen={onOpen} onClose={onClose} config={promptConfig} >
                {promptConfig.content}
            </Dialog>
        </>
    )
}

function ProductRow({ p, setUserAction, onOpen, categories }) {
    //load category from query - will auto update when change
    const categoryFromQuery = categories?.data?.find(c => c._id == p.category._id)
    console.log(categoryFromQuery.color)

    return <Tr>
        <Td display={["none", "none", "table-cell"]} pl={2} pr={2}>
            {p.image && <Image minW="10" w="100%" src={p.image.replace("/upload/", "/upload/w_50/")} alt={p.name} />}
        </Td>
        <Td maxW={150} pl={2} pr={0} >
            <Tooltip hasArrow label={p.description} >
                <Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
                    {p.name || 0}
                </Text>
            </Tooltip>
        </Td>
        <Td maxW={10} pl={2} pr={2}>
            {p.price?.toLocaleString() || 0} ₪
        </Td>
        <Td display={["none", "table-cell"]} pl={0}>
            <CategoryBadge category={categoryFromQuery} />
        </Td>
        <Td pr={2} pl={0}>
            <ProductMenu product={p} {...{ setUserAction, onOpen }}></ProductMenu>
        </Td>
    </Tr>

}

function ProductMenu({ product, setUserAction, onOpen }) {
    return <Menu placement="bottom">
        <MenuButton border={"0.05em solid"} borderColor={"gray.500"} as={Button} rightIcon={<BiChevronDown />} leftIcon={<IoMdOptions />}>
            הצג פעולות
        </MenuButton>
        <MenuList colorScheme="red" gap={1} border={"0.05em solid"} borderColor={"gray.500"}>
            <MenuItem justifyContent={"center"} onClick={() => {
                setUserAction({ action: "update", product });
                onOpen()
            }}>
                <HStack>
                    <AiOutlineEdit /> <Text>עדכון</Text>
                </HStack>
            </MenuItem>
            <MenuItem background={"red.500"} mg="1" justifyContent={"center"} onClick={() => {
                setUserAction({ action: "delete", product });
                onOpen()
            }}><HStack>
                    <BsFillTrashFill /> <Text>מחיקה</Text>
                </HStack>
            </MenuItem>
        </MenuList>
    </Menu>
}

export default ProductsTable