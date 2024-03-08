import { Card } from "@chakra-ui/react"
import CategoriesTable from "../components/categories/CategoriesTable"
import useQueryLogic from "../hooks/useQueryLogic";
import Error from "../components/partial/Error";

function Categories() {
    const { isLoading, data, error } = useQueryLogic({ "key": "categories", "urlPath": "categories" });

    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <CategoriesTable categories={data} isLoading={isLoading} />
            <Error error={error} />
        </Card>
    )
}
export default Categories