import { Heading, useToast } from "@chakra-ui/react"
import ProductView from "../../components/Product/ProductView"
import useQueryLogic from "../../hooks/useQueryLogic"
import { useNavigate } from "react-router-dom"
import { toastError } from "../../utils/toast.helper"
import { useEffect, useState } from "react"
import useTitle from "../../hooks/useTitle"

function Random() {
    const [title, setTitle] = useState("מוצר אקראי")
    useTitle(title)

    const { data: product, error } = useQueryLogic({
        urlPath: "products/random/",
        select: (res) => res.data.product,
        extra: {
            refetchOnWindowFocus: false,
        }
    })

    //change title on product load
    useEffect(() => {
        if (product) {
            setTitle("מוצר אקראי - " + product.name)
        }
    }, [product])

    //if we get error get back to home page
    const toast = useToast()
    if (error) {
        const readableError = error?.response?.data?.message;
        toastError(readableError ? new Error(readableError) : error, toast)
        navigate("/")
    }

    return (
        <>
            <Heading fontSize={"6xl"}>
                מוצר אקראי:
            </Heading>
            <ProductView product={product} />
        </>
    )
}
export default Random