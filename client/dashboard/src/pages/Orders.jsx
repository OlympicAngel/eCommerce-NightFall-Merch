import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider"
import { useQuery } from "react-query"
import axios from "axios"
import OrdersList from "../components/orders/OrdersList"
import { Card } from "@chakra-ui/react"

function Order() {
    const { SERVER } = useContext(AuthContext)
    const { isLoading, data, isError } = useQuery({
        queryKey: ["getOrders"],
        queryFn: async () => await axios.get(`${SERVER}orders/manage`, { withCredentials: true }),
        select: (res) => res.data.orders,
        staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
        refetchInterval: 1000 * 60,
        retry: 0
    })

    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <OrdersList {...{ orders: data }}></OrdersList>
        </Card>

    )
}
export default Order