import { FaShekelSign } from "react-icons/fa";
import { FaSadTear } from "react-icons/fa";
import { BsEmojiSmileFill } from "react-icons/bs";
import { AiFillSmile } from "react-icons/ai";
import { FaUserCheck } from "react-icons/fa";
import { FaUserAltSlash } from "react-icons/fa";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Text,
    HStack,
    Heading,
    Box,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    VStack,
    Flex,
    Image,
    useToast,
    Tooltip,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartProvider';
import BuyButton from '../BuyButton';
import { AuthContext } from '../../context/AuthProvider';


function CartView({ toggleOpen }) {
    const { getItemsCount, cartItems, getCartPrice } = useContext(CartContext)
    const { isAuth } = useContext(AuthContext)
    const { onClose, isOpen, onToggle } = useDisclosure()
    //handle open & close of Drawer
    useEffect(() => {
        //if initial state
        if (toggleOpen == undefined)
            return;
        onToggle()
    }, [toggleOpen])

    // each time the cart changes - calc the amount of items
    const stats = useState({ itemCount: 0, totalPrice: 0 })
    useEffect(() => {
        stats[1]({
            itemCount: getItemsCount(),
            totalPrice: getCartPrice()
        })
    }, [cartItems])


    return (
        <Drawer placement={"right"} onClose={onClose} isOpen={isOpen || !true} size="lg">
            <DrawerOverlay />
            <DrawerContent bg="cardBg" borderEnd={"solid 0.2em"} borderColor={"high.blue"}>
                <DrawerCloseButton bg="purple.300" _hover={{ bg: "purple.500" }} boxShadow={"0.2em 0.2em currentColor"} color={"purple.50"} />
                <DrawerHeader>
                    <Heading>
                        <HStack>
                            <Text>סל קניות</Text>
                            <Text opacity="0.3" fontWeight={100}>({stats[0].itemCount})</Text>
                        </HStack>
                    </Heading>
                </DrawerHeader>
                <DrawerBody p="0">
                    <Alert status='warning' variant='left-accent' pe={"0.2em"}>
                        <AlertIcon as={FaUserAltSlash} />
                        <AlertTitle flex="0.3">
                            {!isAuth ? "משתמש לא מחובר!" : "משתמש מחובר!"}
                        </AlertTitle>
                        <AlertDescription flex="1">
                            {!isAuth ?
                                ` תוכל בכל זאת לקנות כאורח אך מעקב ההזמנה לא יופיע בפרופיל שלך `
                                :
                                ` לאחר הרכישה תוכל לעקוב על ההזמנה בפרופיל האישי שלך `}
                            {!isAuth ? <FaSadTear size={"1.5em"} style={{ verticalAlign: "middle", display: "inline" }} /> : <BsEmojiSmileFill size={"1.5em"} style={{ verticalAlign: "middle", display: "inline" }} />}
                        </AlertDescription>
                    </Alert>
                    <CartItems />
                </DrawerBody>
                <DrawerFooter p={0} >
                    {stats[0].itemCount > 0 &&
                        <>
                            <BuyButton w="100%">
                                <Heading as={HStack} color="rgb(20,20,20)" justifyContent={"center"}>
                                    <Text>סה"כ: {stats[0].totalPrice.toLocaleString()}</Text><FaShekelSign size={"0.5em"} />
                                </Heading>
                            </BuyButton>
                        </> ||
                        <Alert status='error' variant='solid' justifyContent={"center"} color={"#fff"}>
                            <AlertIcon color={"#fff"} />
                            - לא הוספת לסל עדיין שום דבר  -
                        </Alert>
                    }
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}


function CartItems({ }) {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext)
    const toast = useToast();

    return <Flex gap={"1em"} flexWrap={"wrap"} p={"1em"}>
        {cartItems?.map(p => {
            const product = p.ref;
            return <Flex key={p.product} minW={"max(45%,200px)"} flex={["1", "0.5"]} gap={"0.2em"} flexDir={"row"} alignItems={"center"} justifyContent={"space-around"}>
                <Image borderRadius="md" flex="1" objectFit='cover' maxW={"40%"} src={product?.image} alt={product?.name}
                    fallbackSrc='/images/noImage.jpg'>
                </Image>
                <Box>
                    <Text opacity="0.7" flex="0">{product.name}</Text>
                    <Text>₪{product?.price?.toLocaleString()}{product?.price % 1 == 0 && ".00"}</Text>
                    <Flex mt={"0.5em"} gap={"0.2em"} fontSize={"0.85em"} >
                        <Button variant={"ghost"} style={{ "WebkitTextStroke": "0.1em" }} onClick={() => addToCart(product)} isDisabled={p.quantity >= 10}>+</Button>
                        <Text as="h5" minW={"2ch"} fontSize={"2em"} textAlign={"center"}>{p.quantity}</Text>
                        <Tooltip bg="red.700" color="white" label='מחיקת המוצר מהסל לגמרי?' hasArrow isDisabled={p.quantity > 1}>
                            <Button variant={"ghost"} style={{ "WebkitTextStroke": "0.1em" }}
                                onClick={() => {
                                    removeFromCart(product)
                                    if (p.quantity == 0)
                                        toastError(new Error("מוצר נמחק מהסל"), toast)
                                }}>-</Button>
                        </Tooltip>
                    </Flex>
                </Box>
            </Flex>
        })}
    </Flex>
}

export default CartView