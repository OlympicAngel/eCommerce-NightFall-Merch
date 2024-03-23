import { Box, Button, Card, CircularProgress, Flex, HStack, Heading, Image, Skeleton, Text, Tooltip } from "@chakra-ui/react"
import useQueryLogic from "../../hooks/useQueryLogic"
import { FaInfoCircle } from "react-icons/fa"
import { CartContext } from "../../context/CartProvider"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import ErrorView from "../partials/ErrorView"

function RelatedProducts({ product }) {
    // show loader and DON'T initialize Content as it will send invalid use query logic
    const hasProduct = product && product._id;
    console.log(hasProduct)
    return <Skeleton isLoaded={hasProduct} w={"100%"}>
        <Card outlineColor={"high.blue"} p={"0 !important"}>
            <Heading p={"0.2em"}>מוצרים דומים:</Heading>
            <HStack justifyContent={"space-between"} p="1em"
                gap={"2em"} w={"100%"} alignItems={"stretch"} overflow={"auto !important"}>
                {hasProduct && <Content product={product} />}
            </HStack>
        </Card>
    </Skeleton>
}
export default RelatedProducts

function Content({ product }) {
    const { data: products, isLoading, error } = useQueryLogic({
        key: "products_related_" + product._id,
        "urlPath": "products/related/" + product._id,
    })
    return (
        <>
            {products?.map((p, i) => <RelatedProduct key={p._id} product={p} isLoading={isLoading} />)}
            <ErrorView error={error} />
        </>
    )
}

function RelatedProduct({ product, isLoading }) {
    const { addToCart, checkIsOnCart, cartItems, OpenCart, deleteFromCart } = useContext(CartContext);
    const [isOnCart, setIsOnCart] = useState(false)

    //update is on cart when cart changes
    useEffect(() => {
        setIsOnCart(checkIsOnCart(product))
    }, [cartItems])

    const similarValue = Math.min(1, Math.pow(product.similarityScore / 2.8, 0.5));

    const containerStyle = {
        minW: "200px",
        aspectRatio: 1,
        m: "0 !important",
        flex: 1,
    }

    if (isLoading)
        return <Skeleton isLoaded={!isLoading}>
            <Box {...containerStyle}>

            </Box>
        </Skeleton>


    return <Flex flexDir={"column"} position={"relative"} alignItems={"stretch"} {...containerStyle}>
        <Image borderRadius="md" flex="1" objectFit='cover' maxH={["auto", "auto", "80%"]} src={product?.image} alt={product?.name}
            fallbackSrc='https://via.placeholder.com/150'>
        </Image>
        <Tooltip label="עוד פרטים על המוצר">
            <Button m={0} as={Link} to={`../product/${product._id}/${product.name}`} alt={"עוד מידע על " + product?.name} colorScheme="blue" p={0} borderRadius={"100%"}
                position={"absolute"} inset={"2% 2% 0 0"} fontSize={"clamp(1em,4.5vmin,2em)"} width="clamp(1.2em,4.5vmin,1.4em)" h={"auto"} aspectRatio={1}>
                <FaInfoCircle />
            </Button>
        </Tooltip>
        <Tooltip label={"רמת השוואה - " + ~~(similarValue * 100) + "%"} >
            <CircularProgress value={similarValue} max={1} position={"absolute"} left="1%" top="1%"
                size={"1.2em"} thickness={"2.3em"} color="high.purple" trackColor="purple.900" />
        </Tooltip>
        <Text opacity="0.7" flex="0">{product.name}</Text>
        <Text>₪{product?.price?.toLocaleString()}{product?.price % 1 == 0 && ".00"}</Text>
        <Flex mt={"0.5em"} gap={"0.2em"}>
            {
                isOnCart
                && <>
                    <Button variant={"ghost"} onClick={() => deleteFromCart(product)} colorScheme="red"><MdDelete size={"1em"} /></Button>
                    <Button variant={"link"} onClick={OpenCart} color="high.blue" fontWeight={100} flex="1">עבור לתשלום</Button>
                </>
                || <Button flex="1" fontSize={isOnCart && "1.1em" || "1.5em"} onClick={() => addToCart(product)}>הוסף לסל</Button>
            }
        </Flex>
    </Flex>
}