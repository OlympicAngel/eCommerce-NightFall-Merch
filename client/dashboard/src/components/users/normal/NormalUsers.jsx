import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useQuery } from "react-query";
import axios from "axios";
import { Box, Spinner } from "@chakra-ui/react";
import HeaderCRUD from "../../partial/HeaderCRUD";
import SearchList, { useSearchLogic } from "../../Sorters&Filters/SearchList";
import SortButtons, { SortBtn } from "../../Sorters&Filters/SortButtons";
import UserTable from "./UserTable";

function NormalUsers() {
    const { SERVER } = useContext(AuthContext)

    //get data
    const { isLoading, isError, error, data } = useQuery(
        {
            queryKey: ["getUsers"],
            queryFn: async () => await axios(SERVER + "users/manage", { withCredentials: true }),
            select: (res) => res.data.users, //filter data to get only needed part
            staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
            refetchInterval: 1000 * 60,
            retry: 0
        }
    );

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

    if (isLoading)
        <Box position="relative" minH={"10vh"}>
            <Spinner color="purple.100" size='xl' position={"absolute"} inset={0} margin={"auto"}></Spinner>
        </Box>

    /** @type {[]} */
    const users = data || [];
    const filteredUsers = users.filter(searchLogic.filterFn).sort(sortLogic.sortFn);

    return (
        <>
            <HeaderCRUD name="משתמשים" list={filteredUsers} onAdd={() => { }}>
            </HeaderCRUD>
            <br />
            <SearchList searchLogic={searchLogic} list={users} filteredList={filteredUsers}></SearchList>
            <SortButtons sortLogic={sortLogic} colorScheme="blue"></SortButtons>
            <UserTable users={filteredUsers} colorScheme="teal"></UserTable>
        </>
    )
}
export default NormalUsers