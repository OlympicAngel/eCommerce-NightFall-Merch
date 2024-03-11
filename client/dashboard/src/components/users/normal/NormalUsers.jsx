import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import HeaderCRUD from "../../partial/HeaderCRUD";
import SearchList, { useSearchLogic } from "../../Sorters&Filters/SearchList";
import SortButtons, { SortBtn } from "../../Sorters&Filters/SortButtons";
import UserTable from "./UserTable";
import Loader from "../../partial/Loader";
import useQueryLogic from "../../../hooks/useQueryLogic";
import Error from "../../partial/Error";
import { Flex, useDisclosure } from "@chakra-ui/react";
import Dialog from "../../partial/Dialog";
import UserForm from "../../forms/UserForm";
import useTitle from "../../../hooks/useTitle";


function NormalUsers() {
    useTitle("משתמשים")


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editUser, setEditUser] = useState();

    //when setting user - open edit view
    useEffect(() => {
        if (editUser && !isOpen)
            onOpen();
    }, [editUser])

    //get data
    const { isLoading, error, data } = useQueryLogic({ "key": "users", "urlPath": "users/manage" })

    //search
    const searchLogic = useSearchLogic();
    //sort
    const sortLogic = SortBtn.useSortLogic([
        new SortBtn("תאריך הרשמה", (u1, u2) => 1),
        new SortBtn("שם פרטי", (u1, u2) => u1.name < u2.name ? -1 : 1),
        new SortBtn("כתובת", (u1, u2) => u1.address?.city < u2.address?.city ? -1 : 1),
        new SortBtn("כמות הזמנות", (u1, u2) => u1.orders.length < u2.orders.length ? -1 : 1),
        new SortBtn("שווי כספי", (u1, u2) => calcWorth(u1.orders) < calcWorth(u1.orders) ? -1 : 1)])
    function calcWorth(orders) {
        return orders.reduce((pre, o) => pre + o.total_price, 0)
    }

    /** @type {[]} */
    const users = data || [];
    const filteredUsers = users.filter(searchLogic.filterFn).sort(sortLogic.sortFn);

    return (
        <Flex flexDirection={"column"} gap={"0.5em"}>
            <HeaderCRUD name="משתמשים" list={filteredUsers} onAdd={onOpen}>
            </HeaderCRUD>
            <SearchList searchLogic={searchLogic} list={users} filteredList={filteredUsers}></SearchList>
            <SortButtons sortLogic={sortLogic} colorScheme="blue"></SortButtons>
            {isLoading &&
                <Loader /> ||
                <UserTable users={filteredUsers} colorScheme="teal" setEditUser={setEditUser}></UserTable>
            }
            <Error error={error} />
            <UserDialog {...{ isOpen, onOpen, onClose, user: editUser, resetUser: setEditUser }} />
        </Flex>
    )
}

function UserDialog({ isOpen, onOpen, onClose, user, resetUser }) {
    const closeAndReset = () => {
        resetUser();
        onClose();
    }
    return <Dialog {...{ isOpen, onOpen, onClose, config: { hasForm: true, w: "fit-content" } }}>
        <UserForm onClose={closeAndReset} user={user}></UserForm>
    </Dialog>
}
export default NormalUsers