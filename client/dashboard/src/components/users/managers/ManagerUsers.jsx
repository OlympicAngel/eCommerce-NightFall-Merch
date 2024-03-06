import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useQuery } from "react-query";
import axios from "axios";
import { Box, Spinner, useDisclosure } from "@chakra-ui/react";
import HeaderCRUD from "../../partial/HeaderCRUD";
import SearchList, { useSearchLogic } from "../../Sorters&Filters/SearchList";
import SortButtons, { SortBtn } from "../../Sorters&Filters/SortButtons";
import ManagerTable from "./ManagerTable";
import ManagerForm from "../../forms/ManagerForm";
import Dialog from "../../partial/Dialog";

function ManagerUsers() {
    const { SERVER } = useContext(AuthContext)
    const [openManagerDialog, setOpenManagerDialog] = useState(false);

    //get data
    const { isLoading, isError, error, data } = useQuery(
        {
            queryKey: ["getManagers"],
            queryFn: async () => await axios(SERVER + "users/managers", { withCredentials: true }),
            select: (res) => res.data.managers, //filter data to get only needed part
            staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
            refetchInterval: 1000 * 60,
            retry: 0
        }
    );

    //search
    const searchLogic = useSearchLogic();
    //sort
    const sortLogic = SortBtn.useSortLogic([
        new SortBtn("רמת ניהול", (u1, u2) => u1.permission < u2.permission ? 1 : -1),
        new SortBtn("תאריך הרשמה", (u1, u2) => 1),
        new SortBtn("שם פרטי", (u1, u2) => u1.name < u2.name ? -1 : 1)])

    if (isLoading)
        <Box position="relative" minH={"10vh"}>
            <Spinner color="purple.100" size='xl' position={"absolute"} inset={0} margin={"auto"}></Spinner>
        </Box>

    /** @type {[]} */
    const managers = data || [];
    const filteredManagers = managers.filter(searchLogic.filterFn).sort(sortLogic.sortFn);

    return (
        <>
            <HeaderCRUD name="מנהלים" list={filteredManagers} onAdd={() => { setOpenManagerDialog(true) }}>
            </HeaderCRUD>
            <br />
            <SearchList searchLogic={searchLogic} list={managers} filteredList={filteredManagers}></SearchList>
            <SortButtons sortLogic={sortLogic} colorScheme="pink"></SortButtons>
            <ManagerTable managers={filteredManagers} colorScheme="blackAlpha"></ManagerTable>
            <ManagerDialog open={openManagerDialog} setClose={setOpenManagerDialog} />
        </>
    )
}
export default ManagerUsers

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