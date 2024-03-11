import { Card } from "@chakra-ui/react";
import ProductsTable from "../components/products/ProductsTable";
import useQueryLogic from "../hooks/useQueryLogic";
import Error from "../components/partial/Error";
import useTitle from "../hooks/useTitle";

export default function Products() {
    useTitle("רשימת מוצרים")

    const { isLoading, error, data } = useQueryLogic({ "key": "products", "urlPath": "products" })
    const products = data || [];

    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <ProductsTable {...{ isLoading, products }}></ProductsTable>
            <Error error={error} />
        </Card>
    )
}

