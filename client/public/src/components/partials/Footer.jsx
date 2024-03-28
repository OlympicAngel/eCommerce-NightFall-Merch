import { BiDice3 } from "react-icons/bi";
import { BiInfoCircle } from "react-icons/bi";
import { FiHelpCircle } from "react-icons/fi";
import { BiListUl } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { BiLogInCircle } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";
import { FaTiktok } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { AiOutlineLink } from "react-icons/ai";
import { Box, Button, Container, Flex, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { CartContext } from "../../context/CartProvider";
import useLogout from "../../hooks/useLogout";

function Footer() {
    const logout = useLogout()
    const { isAuth } = useContext(AuthContext)
    const { OpenCart } = useContext(CartContext)

    //TODO: handel all links destinations

    return (
        <Box as={"nav"} bg="gray" p={["0.5em", "1em"]} borderTop={"solid 0.2em gray"} mt={"2em"}>
            <Flex as={Container} maxW="4xl" gap={"1em"} flexWrap={"wrap"} justifyContent={["center", "space-between"]}>

                <FooterSection title="ניווט באתר">
                    <FooterLink to={"/"} text={"מוצרים"} icon={<BiListUl />} />
                    <FooterLink to={"/random"} text={"מוצר אקראי"} icon={<BiDice3 />} />
                    <FooterLink to={"/contact"} text={"צור קשר"} icon={<FiHelpCircle />} />
                    <FooterLink to={"/about"} text={"עלינו"} icon={<BiInfoCircle />} />
                </FooterSection>

                <FooterSection title="משתמש">
                    <FooterLink onClick={OpenCart} text={"סל קניות"} icon={<BsCart3 />} />
                    {isAuth &&
                        <>
                            <FooterLink to={"/profile"} text={"פרופיל"} icon={<CgProfile />} />
                            <FooterLink onClick={() => logout} text={"התנתקות"} icon={<IoMdLogOut />} />
                        </> ||
                        <>
                            <FooterLink to={"/login"} text={"התחברות"} icon={<BiLogInCircle />} />
                            <FooterLink to={"/register"} text={"הרשמה"} icon={<BiUserPlus />} />
                        </>
                    }
                </FooterSection>

                <FooterSection title="סושיאל">
                    <FooterLink to={"https://www.nightfall.co.il/"} text={"אתר נייטפול"} icon={<AiOutlineLink />} />
                    <FooterLink to={"https://www.nightfall.co.il/discord"} text={"דיסקורד"} icon={<BsDiscord />} />
                    <FooterLink to={"https://www.youtube.com/@Nightfall_Community"} text={"יוטיוב"} icon={<AiFillYoutube />} />
                    <FooterLink to={"https://www.tiktok.com/@nightfall.community"} text={"טיקטוק"} icon={<FaTiktok />} />

                </FooterSection>

                <VStack flex={[1, 0]} minW={"150px"} maxW={"30vw"}>
                    <Image src="/images/logo.png" alt="לוגו נייטפול"></Image>
                </VStack>
            </Flex>
        </Box>
    )
}

function FooterSection({ title, children }) {
    return <VStack flex={[1, 0.1]} minW={["40%", "auto"]} alignItems={"flex-start"}>
        <Heading as={"h3"} size={"md"} borderBottom="0.1em solid currentColor" w={"100%"}>{title}</Heading>
        {children}
    </VStack>
}

function FooterLink({ to, text, onClick, icon }) {
    return <Link to={to || "#"} onClick={() => onClick && onClick()} alt={text}>
        <HStack minW="100px" ps={"0.5em"} as={Button} colorScheme="black" variant={"link"} justifyContent={"start"}>
            {icon && icon}
            <Text whiteSpace={"nowrap"} fontWeight={100}>
                {text}
            </Text>
        </HStack>
    </Link>
}
export default Footer