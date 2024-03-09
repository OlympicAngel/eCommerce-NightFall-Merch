
import OrdersList from "../components/orders/OrdersList"
import { Card } from "@chakra-ui/react"
import useQueryLogic from "../hooks/useQueryLogic"
import Error from "../components/partial/Error";
import Pagination, { usePaginationLogic } from "../components/Sorters&Filters/Pagination";

function Order() {
    const paginationLogic = usePaginationLogic()
    let { isLoading, data, error } = useQueryLogic({
        "key": ["orders", paginationLogic.itemsPerPages, paginationLogic.cPage],
        "urlPath": `orders/manage?page=${paginationLogic.cPage + 1}&limit=${paginationLogic.itemsPerPages}`,
        select: res => res.data
    });

    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <OrdersList {...{ orders: data?.orders, isLoading }}></OrdersList>
            {data?.pages != undefined && <Pagination paginationLogic={paginationLogic} pages={data?.pages} />}
            <Error error={error} />
        </Card>
    )
}
export default Order