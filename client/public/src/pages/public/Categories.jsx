import { Box, Card, CardBody, Divider, Flex, Grid, GridItem, HStack, Heading, Image, Skeleton, Text, VStack, useToast } from "@chakra-ui/react"
import ErrorView from "../../components/partials/ErrorView"
import useQueryLogic from "../../hooks/useQueryLogic"
import { Link, useNavigate, useParams } from "react-router-dom"
import ProductCard from "../../components/Product/ProductCard"
import { toastError } from "../../utils/toast.helper"
import { useEffect } from "react"

function Categories() {
    const { data: categories = new Array(5).fill(false), isLoading, error } = useQueryLogic({
        "key": "categories",
        "urlPath": "categories"
    })

    const navigate = useNavigate()
    const toast = useToast()
    const { categoryName } = useParams()
    //find category id by name inputed in params
    const categoryID = categories.find(c => c.name == categoryName)?._id
    useEffect(() => {
        //if not found reset url & output error message
        if (categoryName && !categoryID && !isLoading) {
            navigate("/categories")
            toastError(new Error(`הקטגוריה "${categoryName}" - לא קיימת`), toast)
        }
    }, [categoryName])


    return (
        <>
            <Heading as="h1" fontSize={"7xl"} mb={"0.5em"}>קטגוריות:</Heading>
            <ErrorView error={error} />
            <Flex gap={["0.5em", "1em", "2em"]} flexWrap={"wrap"} alignContent={"center"} justifyContent={"center"} height={categoryID ? "auto" : "50vh"}>
                {categories.map(c => <Category key={c._id || Math.random()} isLoading={isLoading} c={c} />)}
            </Flex>
            {
                categoryID && <Card mt={"3em"}>
                    <Heading>מוצרים בקטגוריית: {categoryName}</Heading>
                    <CategoryProducts categoryID={categoryID} />
                </Card>
            }
        </>
    )
}
export default Categories

function Category({ isLoading, c }) {
    return <GridItem>
        <Skeleton isLoaded={!isLoading} borderRadius={"full"} aspectRatio={1} w={"20vmin"} minW={"9em"}>
            <Card as={Link} to={`/categories/${c?.name}`} flex="1" p="0" outlineColor={c?.color + ".200"}
                overflow={"hidden"} borderRadius={"full"} boxShadow={"dark-lg"}
                _after={{
                    content: '""', position: "absolute", "inset": 0, bg: c?.color + ".900", borderRadius: "inherit",
                    mixBlendMode: "hard-light", opacity: "0.7",
                }}
                _hover={{
                    _after: {
                        opacity: 1,
                    },
                }}
            >
                <Image src={c?.image} alt={c?.name} fallbackSrc='/images/noImage.jpg' objectFit='cover' />
                <Flex position="absolute" w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"} zIndex={1}>
                    <Heading color={c?.color + ".100"} fontSize={["2xl", "3xl", "4xl"]}
                        textShadow={" -0.02em -0.03em #fff, 0.05em 0.1em #000,0.05em 0.1em 0.5em #000,0 0 1em #000"}>
                        {c.name}
                    </Heading>
                </Flex>
            </Card>
        </Skeleton>
    </GridItem>
}

function CategoryProducts({ categoryID }) {
    const { data: products = new Array(4).fill(undefined), error, isLoading } = useQueryLogic({
        "key": "category_" + categoryID,
        "urlPath": "products/c/" + categoryID,
        "select": (res) => res.data.products
    })

    console.log(products)

    return <>
        <VStack>
            <Grid className="grid">
                {
                    products.map((p, i) =>
                        <ProductCard key={p?._id || i} product={p}>
                        </ProductCard>)
                }
            </Grid>
            {products.length == 0 && <Text>- אין כרגע מוצרים בקטגוריה זו -</Text>}
            <ErrorView error={error} />
        </VStack>
    </>
}