import { FaInfoCircle } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { Badge, Box, Button, Card, HStack, Heading, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, Spacer, Text, Tooltip, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartProvider";
import { toastError, toastSuccess } from "../../utils/toast.helper";
import { Link } from "react-router-dom";


function ProductCard({ product = { _id: "", name: "", price: 0 }, onAddToCart, children }) {
    const { checkIsOnCart, cartItems } = useContext(CartContext)
    const [isOnCart, setIsOnCart] = useState(false)

    //update {isOnCart} when cart changes
    useEffect(() => {
        setIsOnCart(checkIsOnCart(product))
    }, [cartItems])

    const { isOpen, onClose, onOpen } = useDisclosure({ "isOpen": children != undefined })

    return (
        <Card height={"-webkit-fill-available"} w="-webkit-fill-available"
            outlineColor={isOnCart ? "high.purple" : "none"} p={0}
            boxShadow={isOnCart ? "0 0 1em red" : "0 0 0 0 purple"}>
            {product.category &&
                <Badge colorScheme={product.category.color} fontSize={["sm", "md"]}
                    borderTopRightRadius={"inherit"} variant='solid' position={"absolute"}>{product.category.name}</Badge>
            }
            <Skeleton isLoaded={product._id}>
                <Image objectFit='cover' width="100vw" src={product.image} alt={product.name} aspectRatio={"1"} fallbackSrc='https://via.placeholder.com/150'></Image>
            </Skeleton>
            <VStack height={"-webkit-fill-available"}>
                <ProductInfo {...{ isOnCart, product }} />
                <Spacer flex="1"></Spacer>
                <ProductsButtons {...{ isOnCart, product, onAddToCart }} />
            </VStack>
            {children &&
                <Popover isOpen={isOpen} onClose={() => { onAddToCart(); }}>
                    <PopoverTrigger>
                        <Text></Text>
                    </PopoverTrigger>
                    <PopoverContent w="100vw">
                        {children}
                    </PopoverContent>
                </Popover>}

        </Card>
    )
}
export default ProductCard

function ProductInfo({ isOnCart, product }) {
    return <Box w={"100%"} p="0.5em" pb="0">
        <Heading size='md' >
            <HStack justifyContent={"space-between"}>
                <Skeleton isLoaded={product._id} >
                    <Text>{product.name || "טקסט שסתם תופס מקום"}</Text>
                </Skeleton>
                <Skeleton isLoaded={product._id}>
                    <HStack fontSize='2xl'>
                        <HStack>
                            <Text fontSize={"md"} whiteSpace={"nowrap"}>{isOnCart && (isOnCart.quantity + " x")}</Text>
                            <Text color={isOnCart ? "high.purple" : "high.blue"}>{product.price.toLocaleString()}{product?.price % 1 == 0 && ".00"}</Text>
                        </HStack>
                        <Text fontSize={"md"}>₪</Text>
                    </HStack>
                </Skeleton>
            </HStack>
        </Heading>
    </Box>;
}

function ProductsButtons({ isOnCart, product, onAddToCart }) {
    const { isOpen, onToggle, onClose, onOpen } = useDisclosure()

    const { addToCart, removeFromCart, OpenCart } = useContext(CartContext);
    const toast = useToast()

    function handleCartBtn() {
        if (!isOnCart) {
            addToCart(product)
            toastSuccess((<Box>המוצר נוסף לסל  - <Button onClick={() => OpenCart() || toast.closeAll()}>לתשלום</Button></Box>), toast)
            onAddToCart && onAddToCart(product)
        }
        else
            onOpen();
    }

    return <HStack p="0.5em" pt="0" w="100%" m="0 !important">
        <Popover isOpen={isOpen && isOnCart} onClose={onClose} openDelay={5000}>
            <PopoverTrigger>
                <Skeleton isLoaded={product._id} flex={~~!!isOnCart} >
                    <Button w={isOnCart ? "100%" : "0px"} colorScheme={isOnCart ? "purple" : "orange"}
                        borderRadius={isOnCart ? "0.3rem" : "100%"} overflow={"hidden"}
                        p="0" onClick={handleCartBtn}>
                        <HStack>
                            <Text filter="drop-shadow(0 0 0.05em #000) drop-shadow(0 0 0.1em #000)">
                                {isOnCart
                                    && <FaCartArrowDown size={"1em"} />
                                    || <FaCartPlus size={"1.2em"} />
                                }
                            </Text>
                            {isOnCart && <Text>שנה כמות</Text>}
                        </HStack>
                    </Button>
                </Skeleton>
            </PopoverTrigger>
            <PopoverContent onMouseLeave={onClose} bg="cardBg" filter={"drop-shadow(0 0 0.5em rgba(0,0,0,0.5))"}>
                <PopoverArrow bg="cardBg" />
                <PopoverHeader>
                    <Heading as={"h4"} fontSize={"xl"}>
                        <HStack>
                            <Text>כרגע בסל:</Text>
                            <Spacer></Spacer>
                            <Text color="high.purple">₪{isOnCart?.quantity * isOnCart?.ref?.price || 0}</Text>
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

        <Skeleton isLoaded={product._id} flex={~~!isOnCart}>
            <Button as={Link} state={{ product }} to={`../product/${product._id}/${product.name}`} alt={"עוד מידע על " + product?.name} colorScheme="blue"
                w={!isOnCart ? "100%" : "0"} borderRadius={!isOnCart ? "0.3rem" : "100%"} overflow={"hidden"}
                p="0">
                {!isOnCart && <Heading size={"lg"}>עוד מידע</Heading> || <Text filter="drop-shadow(0.1em 0.1em 0.05em rgba(0,0,0,0.6))">
                    <FaInfoCircle />
                </Text>}
            </Button>
        </Skeleton>
    </HStack>
}