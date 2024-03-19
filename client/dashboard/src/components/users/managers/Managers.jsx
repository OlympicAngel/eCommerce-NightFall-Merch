import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { Flex, useDisclosure } from "@chakra-ui/react";
import HeaderCRUD from "../../partial/HeaderCRUD";
import SearchList, { useSearchLogic } from "../../Sorters&Filters/SearchList";
import SortButtons, { SortBtn } from "../../Sorters&Filters/SortButtons";
import ManagerTable from "./ManagerTable";
import ManagerForm from "../../forms/ManagerForm";
import Dialog from "../../partial/Dialog";
import useQueryLogic from "../../../hooks/useQueryLogic";
import Loader from "../../partial/Loader";
import Error from "../../partial/Error";
import useTitle from "../../../hooks/useTitle";

function Managers() {
    useTitle("מנהלים")

    const [openManagerDialog, setOpenManagerDialog] = useState(false);

    //get data
    const { isLoading, error, data } = useQueryLogic({ "key": "managers", "urlPath": "users/managers" })

    //search
    const searchLogic = useSearchLogic();
    //sort
    const sortLogic = SortBtn.useSortLogic([
        new SortBtn("רמת ניהול", (u1, u2) => u1.permission < u2.permission ? 1 : -1),
        new SortBtn("תאריך הרשמה", (u1, u2) => 1),
        new SortBtn("שם פרטי", (u1, u2) => u1.name < u2.name ? -1 : 1)])

    /** @type {[]} */
    const managers = data || [];
    const filteredManagers = managers.filter(searchLogic.filterFn).sort(sortLogic.sortFn);

    return (
        <Flex flexDirection={"column"} gap={"0.5em"}>
            <HeaderCRUD name="מנהלים" list={filteredManagers} onAdd={() => { setOpenManagerDialog(true) }}>
            </HeaderCRUD>
            <SearchList searchLogic={searchLogic} list={managers} filteredList={filteredManagers}></SearchList>
            <SortButtons sortLogic={sortLogic} colorScheme="pink"></SortButtons>
            {isLoading &&
                <Loader /> ||
                <ManagerTable managers={filteredManagers} colorScheme="blackAlpha"></ManagerTable>
            }
            <Error error={error} />
            <ManagerDialog open={openManagerDialog} setClose={setOpenManagerDialog} />
        </Flex>
    )
}
export default Managers

export function ManagerDialog({ manager, open, setClose }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {
        if (!open)
            return;
        onOpen();
        setClose && setClose();
    }, [open])
    return <Dialog {...{ isOpen, onOpen, onClose, config: { hasForm: true } }}>
        <ManagerForm manager={manager} onClose={onClose}></ManagerForm>
    </Dialog>
}