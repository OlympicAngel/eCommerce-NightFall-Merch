import { Card } from "@chakra-ui/react"
import CategoryForm from "../components/forms/CategoryForm"
import { useQueries, useQuery } from "react-query"
import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider"
import CategoriesTable from "../components/categories/CategoriesTable"

function Categories() {
    const { SERVER } = useContext(AuthContext)
    const { isLoading, data, isError } = useQuery({
        queryKey: "getCategories",
        queryFn: async () => axios.get(SERVER + "categories"),
        select: (res) => res.data.categories,
        staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
        refetchInterval: 1000 * 60,
        retry: 0
    })
    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <CategoriesTable categories={data} />
        </Card>


    )
}
export default Categories