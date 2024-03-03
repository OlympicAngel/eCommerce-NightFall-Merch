import { Card } from "@chakra-ui/react"
import CategoriesTable from "../components/categories/CategoriesTable"
import useGetCategories from "../hooks/useGetCategories"

function Categories() {
    const { isLoading, data, isError } = useGetCategories();
    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <CategoriesTable categories={data} />
        </Card>


    )
}
export default Categories