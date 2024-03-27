import { Box, Button, Container, Flex, HStack, Heading, Image, Stack, Text, VStack } from "@chakra-ui/react"
import { useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import { AuthContext } from "../../context/AuthProvider"
import { CartContext } from "../../context/CartProvider"

function Footer() {
    const { isAuth } = useContext(AuthContext)
    const { OpenCart } = useContext(CartContext)

    //TODO: handel all links destinations

    return (
        <Box as={"nav"} bg="gray" p={["0.5em", "1em"]} borderTop={"solid 0.2em gray"}>
            <Flex as={Container} maxW="4xl" gap={"1em"} flexWrap={"wrap"} justifyContent={["center", "space-between"]}>

                <FooterSection title="ניווט באתר">
                    <FooterLink to={"/"} text={"מוצרים"} />
                    <FooterLink to={"/contact"} text={"צור קשר"} />
                    <FooterLink to={"/about"} text={"עלינו"} />
                </FooterSection>

                <FooterSection title="משתמש">
                    <FooterLink onClick={OpenCart} text={"סל קניות"} />
                    {isAuth &&
                        <>
                            <FooterLink to={"/"} text={"פרופיל"} />
                            <FooterLink to={"/"} text={"הזמנות"} />
                            <FooterLink to={"/"} text={"התנתקות"} />
                        </> ||
                        <>
                            <FooterLink to={"/login"} text={"התחברות"} />
                            <FooterLink to={"/register"} text={"הרשמה"} />
                        </>
                    }
                </FooterSection>

                <VStack flex={[1, 0]} minW={"150px"} maxW={"30vw"}>
                    <Image src="/images/logo.png"></Image>
                </VStack>
            </Flex>
        </Box>
    )
}

function FooterSection({ title, children }) {
    return <VStack flex={[1, 0.1]} minW={["40%", "auto"]}>
        <Heading as={"h3"} size={"md"} borderBottom="0.1em solid currentColor" w={"100%"}>{title}</Heading>
        {children}
    </VStack>
}

function FooterLink({ to, text, onClick, icon }) {
    return <Link as={NavLink} to={to || "#"} onClick={() => onClick && onClick()}>
        <HStack minW="100px" ps={"0.5em"} as={Button} colorScheme="black" variant={"link"} justifyContent={"start"}>
            {icon && icon}
            <Text whiteSpace={"nowrap"} fontWeight={100}>
                {text}
            </Text>
        </HStack>
    </Link>
}
export default Footer