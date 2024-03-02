import { Card, Skeleton } from "@chakra-ui/react";
import ProductsTable from "../components/products/ProductsTable";
import useFetch from "../hooks/useFetch";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "react-query";
import axios from "axios";

export default function Products() {
    const { SERVER } = useContext(AuthContext)

    const { isLoading, isError, error, data } = useQuery(
        {
            queryKey: ["getProducts"],
            queryFn: async () => await axios(SERVER + "products"),
            select: (res) => res.data.products, //filter data to get only needed part
            staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
            refetchInterval: 1000 * 60,
            retry: 0
        }
    );
    const products = data || [];

    return (
        <Card w="100%" p={["0.5em", "1em"]} boxShadow="2xl" bg="black.100">
            <ProductsTable {...{ isLoading, products }}></ProductsTable>
        </Card>
    )
}

