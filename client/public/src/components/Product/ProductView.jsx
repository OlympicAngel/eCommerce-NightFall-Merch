import { MdDelete } from "react-icons/md";
import { FaCcDinersClub } from "react-icons/fa";
import { FaCcJcb } from "react-icons/fa";
import { FaCcDiscover } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import { AiFillCheckCircle } from "react-icons/ai";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Button, Card, Flex, HStack, Heading, Image, Skeleton, SkeletonText, Spacer, Text, Tooltip, VStack, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartProvider";
import { toastError } from "../../utils/toast.helper";
import RelatedProducts from "./RelatedProducts";

function ProductView({ product = { _id: "", name: "", price: 0 } }) {
    const { checkIsOnCart, cartItems } = useContext(CartContext)
    const [isOnCart, setIsOnCart] = useState(false)

    //update is on cart when cart changes
    useEffect(() => {
        setIsOnCart(checkIsOnCart(product))
    }, [cartItems])

    return (<Flex flexDir={"column"} w={"100%"} gap={"3em"}>
        <Card>
            <Flex w="100%" flexDir={"row-reverse"} justifyContent={"center"} flexWrap={"wrap"} gap={"1em"}>
                <Skeleton isLoaded={product._id} flex="1" w={"-moz-min-content"}>
                    <Image borderRadius={"0.5em"} width="100%" minW={"max(30vw,20em)"} objectFit='cover' src={product?.image} alt={product?.name} aspectRatio={"1"} fallbackSrc='https://via.placeholder.com/150'></Image>
                </Skeleton>
                <VStack flex="1.5" minW={"45ch"} alignItems={"flex-start"}>
                    <Skeleton isLoaded={product._id}>
                        <Badge colorScheme={product.category?.color} fontSize={["sm", "md"]}
                            borderTopRightRadius={"inherit"} variant='solid'>{product.category?.name || "קטגוריה"}</Badge>
                    </Skeleton>
                    <ProductInfo product={product} />
                    <Spacer />
                    <CartManageUI {...{ product, isOnCart }} />
                </VStack>
            </Flex>
        </Card>
        <RelatedProducts product={product} />
    </Flex>
    )
}
export default ProductView

function ProductInfo({ product }) {
    const lorem = "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית גולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.";


    return <>
        <HStack w={"100%"} justifyContent={"space-between"} flexDir={["column", "row"]} flexWrap={"wrap"} gap={"1em"}>
            <Skeleton isLoaded={product._id}>
                <Heading size={"xl"} whiteSpace={"nowrap"}>{product.name}</Heading>
            </Skeleton>
            <Skeleton isLoaded={product._id}>
                <Heading size={"lg"} color="high.blue">
                    ₪{(product.price || "100").toLocaleString()}{product?.price % 1 == 0 && ".00"}
                </Heading>
            </Skeleton>
        </HStack>
        <SkeletonText isLoaded={product._id}>
            <Text fontSize={["lg"]} m={["auto", "0"]} ms={["auto", "1em"]} maxW={"max(40vw,80%,300px)"} textAlign={"justify"}>
                {product.description || !product._id && lorem || "- אין תיאור למוצר זה -"}
            </Text>
        </SkeletonText>
    </>
}

function CartManageUI({ product, isOnCart }) {
    const { addToCart, removeFromCart, OpenCart, deleteFromCart } = useContext(CartContext);
    const toast = useToast();

    return <>
        <Skeleton isLoaded={product._id} w={"100%"}>
            <Alert status={isOnCart ? "success" : "warning"} variant='left-accent' pe={"0.2em"} >
                <AlertIcon as={AiFillCheckCircle} />
                <AlertTitle flex="0.3">
                    {!isOnCart ? "המוצר לא בסל שלך!" : "המוצר בסל שלך!"}
                </AlertTitle>
                <AlertDescription flex="1">
                    {!isOnCart ? "המוצר הזה עדיין לא בסל שלך, תוכל להוסיף אותו בכל רגע :)" : `תוכל לערוך או להוסיף עוד מוצרים..`}
                </AlertDescription>
            </Alert>
        </Skeleton>
        <Skeleton isLoaded={product._id} w={"100%"} >
            <HStack w={"100%"} mt={"2em"} gap={"2em 0.5em"} justifyContent={"center"}>
                {!isOnCart
                    && <Button px={"3em"} height={"2.5em"} onClick={() => addToCart(product)} me={"auto"}>
                        <Text fontSize={["xx-large"]}>
                            הוסף לסל
                        </Text>
                    </Button>
                    || <>
                        <Text fontSize={"xl"}>כרגע בסל:</Text>
                        <HStack gap={"1em"} as={Card} w={"auto !important"} outline={"1px solid"} outlineColor={"high.purple"} p={"0.5em !important"} justifyContent={"space-between"}>
                            <Button variant={"ghost"} style={{ "WebkitTextStroke": "0.1em" }} onClick={() => addToCart(product)} isDisabled={isOnCart.quantity >= 10}>+</Button>
                            <Heading as="h4" minW={"2ch"} textAlign={"center"}>{isOnCart.quantity}</Heading>
                            <Tooltip bg="red.700" color="white" label='מחיקת המוצר מהסל לגמרי?' hasArrow isDisabled={isOnCart.quantity > 1}>
                                <Button variant={"ghost"} style={{ "WebkitTextStroke": "0.1em" }}
                                    onClick={() => {
                                        removeFromCart(product)
                                        if (isOnCart.quantity == 0)
                                            toastError(new Error("מוצר נמחק מהסל"), toast)
                                    }}>-</Button>
                            </Tooltip>
                        </HStack>
                        <Spacer />
                        <Button colorScheme="red" onClick={() => deleteFromCart(product)} m={"0 !important"} p={[0, 0, "1em"]}>
                            <Text display={["none", "none", "none", "block"]}>מחק מהסל</Text>
                            <Text display={["block", "block", "block", "none"]}><MdDelete size={"2em"} /></Text>
                        </Button>
                    </>
                }
            </HStack>
            {isOnCart &&
                <VStack mt={"2em"} gap={"0.5em"} alignItems={["center", "start"]} w={["100%", "min-content"]} mx={["auto", "0"]}>
                    <HStack w={"100%"}>
                        <Tooltip label="התשלום מתבצע בצורה מאובטחת בעזרת Paypal, פרטי התשלום שלך לא נשמרים בשרתים חיצוניים מחוץ לPaypal..">
                            <Button variant={"outline"} colorScheme="blue">
                                <TbLockSquareRoundedFilled size={"2em"} />
                            </Button>
                        </Tooltip>

                        <HStack as={Button} colorScheme="blue" px={"1em"} onClick={OpenCart} w={["100%", "fit-content"]}>
                            <RiSecurePaymentFill size={"1.2em"} style={{ filter: "drop-shadow(0.15em 0.15em rgba(0,0,0,0.45))" }} />
                            <Text>עבור לתשלום</Text>
                        </HStack>

                    </HStack>
                    <HStack fontSize={"2.5em"} opacity={0.5} w={"100%"} justifyContent={"space-between"}>
                        <Tooltip label="תומך וויזה"><Text><FaCcVisa /></Text></Tooltip>
                        <Tooltip label="תומך מאסטרקארד"><Text><FaCcMastercard /></Text></Tooltip>
                        <Tooltip label="תומך אמריקן אקספרס"><Text><SiAmericanexpress size={"0.8em"} /></Text></Tooltip>
                        <Tooltip label="תומך דיסקובר"><Text><FaCcDiscover /></Text></Tooltip>
                        <Tooltip label="תומך JCB"><Text><FaCcJcb /></Text></Tooltip>
                        <Tooltip label="תומך דינרס קלאב"><Text><FaCcDinersClub /></Text></Tooltip>
                    </HStack>
                </VStack>
            }

        </Skeleton>
    </>
}