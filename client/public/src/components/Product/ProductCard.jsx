import { FaInfoCircle } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { BiAddToQueue } from "react-icons/bi";
import { FaCartArrowDown } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { Badge, Box, Button, Card, HStack, Heading, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spacer, Text, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartProvider";
import { toastError, toastSuccess } from "../../utils/toast.helper";


function ProductCard({ product }) {
    const { checkIsOnCart, cartItems } = useContext(CartContext)
    const [isOnCart, setIsOnCart] = useState(false)

    //update {isOnCart} when cart changes
    useEffect(() => {
        setIsOnCart(checkIsOnCart(product))
    }, [cartItems])

    return (
        <Card key={product._id} height={"-webkit-fill-available"} w="-webkit-fill-available"
            outlineColor={isOnCart ? "high.purple" : "none"}
            boxShadow={isOnCart ? "0 0 1em red" : "0 0 0 0 purple"}>
            {product.category &&
                <Badge colorScheme={product.category.color} fontSize={["sm", "md"]}
                    borderTopRightRadius={"inherit"} variant='solid' position={"absolute"}>{product.category.name}</Badge>
            }
            <Image objectFit='cover' src={product.image} alt={product.name} aspectRatio={"1"} fallbackSrc='https://via.placeholder.com/150'></Image>
            <VStack height={"-webkit-fill-available"}>
                <ProductInfo {...{ isOnCart, product }} />
                <Spacer flex="1"></Spacer>
                <ProductsButtons {...{ isOnCart, product }} />
            </VStack>
        </Card>
    )
}
export default ProductCard

function ProductInfo({ isOnCart, product }) {
    return <Box w={"100%"} p="0.5em" pb="0">
        <Heading size='md' >
            <HStack justifyContent={"space-between"}>
                <Text>{product.name}</Text>
                <HStack fontSize='2xl'>
                    <HStack>
                        <Text fontSize={"md"}>{isOnCart && (isOnCart.quantity + " x")}</Text>
                        <Text color="high.green">{product.price.toLocaleString()}{product?.price % 1 == 0 && ".00"}</Text>
                    </HStack>
                    <Text fontSize={"md"}>₪</Text>
                </HStack>
            </HStack>
        </Heading>
    </Box>;
}

function ProductsButtons({ isOnCart, product }) {
    const { isOpen, onToggle, onClose, onOpen } = useDisclosure()

    const { addToCart, removeFromCart, OpenCart } = useContext(CartContext);
    const toast = useToast()

    function handleCartBtn() {
        if (!isOnCart) {
            addToCart(product)
            toastSuccess((<Box>המוצר נוסף לסל  - <Button onClick={() => OpenCart() || toast.closeAll()}>לתשלום</Button></Box>), toast)
        }
        else
            onOpen();
    }

    return <HStack p="0.5em" pt="0" w="100%" m="0 !important">
        <Popover isOpen={isOpen && isOnCart} onClose={onClose} openDelay={5000}>
            <PopoverTrigger>
                <Button w={isOnCart ? "100%" : "0px"} colorScheme={isOnCart ? "uiPurple" : "green"}
                    borderRadius={isOnCart ? "0.3rem" : "100%"} overflow={"hidden"}
                    p="0" onClick={handleCartBtn}>
                    <HStack>
                        <Text filter="drop-shadow(0 0 0.05em #000) drop-shadow(0 0 0.15em #000)">
                            {isOnCart
                                && <FaCartArrowDown size={"1em"} />
                                || <FaCartPlus size={"1.2em"} />
                            }
                        </Text>
                        {isOnCart && <Text>שנה כמות</Text>}
                    </HStack>
                </Button>
            </PopoverTrigger>
            <PopoverContent onMouseLeave={onClose} bg="cardBg" filter={"drop-shadow(0 0 0.5em rgba(0,0,0,0.5))"}>
                <PopoverArrow bg="cardBg" />
                <PopoverHeader>
                    <Heading as={"h4"} fontSize={"xl"}>
                        <HStack>
                            <Text>כרגע בסל:</Text>
                            <Spacer></Spacer>
                            <Text color="high.green">₪{isOnCart?.quantity * isOnCart?.ref?.price || 0}</Text>
                        </HStack>
                    </Heading>
                </PopoverHeader>
                <PopoverBody>
                    <HStack>
                        <Button fontSize={"2em"} variant='outline' colorScheme="green" isDisabled={isOnCart?.quantity >= 10} onClick={() => addToCart(product)}>
                            <IoIosAddCircle />
                        </Button>
                        <Heading flex="1" textAlign={"center"}>{isOnCart?.quantity?.toLocaleString()}</Heading>
                        <Button fontSize={"2em"} variant='outline' colorScheme="red" onClick={() => {
                            removeFromCart(product)
                            if (isOnCart.quantity == 0)
                                toastError(new Error("מוצר נמחק מהסל"), toast)
                        }}>
                            <IoIosRemoveCircle />
                        </Button>
                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>

        <Button colorScheme="blue" w={!isOnCart ? "100%" : "0"}
            borderRadius={!isOnCart ? "0.3rem" : "100%"} overflow={"hidden"}
            p="0">
            {!isOnCart && <Text>עוד פרטים</Text> || <Text filter="drop-shadow(0.1em 0.1em 0.05em rgba(0,0,0,0.6))">
                <FaInfoCircle />
            </Text>}
        </Button>
    </HStack>
}