import { BsFillTrashFill } from "react-icons/bs";
import { Button, Heading, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import Dialog from "../../partial/Dialog";
import { useEffect } from "react";
import useMutationLogic from "../../../hooks/useMutationLogic";

function UserFullview({ user, close }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    //when prompt close remove user
    const handleClose = () => { onClose(); close && close(); }

    //open user full view when we get user
    useEffect(() => {
        if (!user)
            return;
        onOpen();
    }, [user])

    const deleteUser = useMutationLogic({ "method": "delete", "relatedQuery": "users", "urlPath": "users/manage/" + user?._id, onSuccess: handleClose })
    if (!user)
        return;

    return (
        <Dialog {...{ isOpen, onOpen, onClose: handleClose, config: { header: "תצוגת משתמש", cancel: "", action: "חזור", onConfirm: null, isLoading: deleteUser.isLoading } }}>
            <Menu placement="left" boxShadow="md">
                <MenuButton as={Button} colorScheme="red" leftIcon={<BsFillTrashFill />} isLoading={deleteUser.isLoading} >
                    מחק משתמש
                </MenuButton>
                <MenuList minW={"auto"} boxShadow="dark-lg">
                    <Heading size={"md"} color="red.500">למחוק לצמיתות?</Heading>
                    <MenuDivider />
                    <MenuItem bg="red.800" color="red.50" justifyContent={"center"}
                        _hover={{ background: "red.900" }} onClick={async () => deleteUser.mutate()}>מחק</MenuItem>
                    <MenuItem justifyContent={"center"}>ביטול</MenuItem>
                </MenuList>
            </Menu>
        </Dialog>
    )
}
export default UserFullview