import { TbTableOptions } from "react-icons/tb";
import { BsCardChecklist } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { CgMenu } from "react-icons/cg";
import { BiMessageSquareAdd } from "react-icons/bi";
import { AiFillShop } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { Flex, Link, Box, Button, Text, HStack, useColorMode, Spacer } from "@chakra-ui/react";

if (!localStorage["chakra-ui-color-mode"])
    localStorage["chakra-ui-color-mode"] = "dark"

export default function Nav() {
    const { logout } = useLogout()
    const { colorMode, toggleColorMode } = useColorMode();
    const [isOpen, setIsOpen] = React.useState(false)
    function toggleMenu() {
        setIsOpen(!isOpen)
    }
    return (
        <NavContainer isOpen={isOpen}>
            <MobileMenuIcon {...{ toggleColorMode, colorMode, toggleMenu, isOpen }} />
            <Flex as="nav" w="max-content" margin="auto"
                width={["auto", "100%"]}
                display={[(isOpen ? "flex" : "none"), "flex"]}
                gap={[0, 10]}
                flexDirection={["column", "row"]}
                align="center"
            >
                <MenuItem to="/" icon={<AiFillHome />}> ראשי</MenuItem>
                <MenuItem to="/orders" icon={<BsCardChecklist />}> הזמנות</MenuItem>
                <MenuItem to="/products" icon={<AiFillShop />}> מוצרים</MenuItem>
                <MenuItem to="/categories" icon={<TbTableOptions />}> קטגוריות</MenuItem>


                <Spacer display={["none", "block"]} minH={"1em"} />
                <Flex gap={"0.5em"}>
                    <Button display={["none", "block"]} onClick={toggleColorMode} variant="outline" colorScheme="black">
                        {colorMode == "dark" ? <BsFillSunFill /> : <BsFillMoonStarsFill />}
                    </Button>
                    <Button onClick={() => { logout() }} colorScheme="gray">
                        <TbLogout size={"1.7em"} />
                    </Button>
                </Flex>

            </Flex>
        </NavContainer>
    )
}

function NavContainer({ children, isOpen }) {
    return <>
        <Spacer minH="5.25em" display={isOpen ? ["block", "none"] : ["none"]} />
        <Box top="0"
            position={isOpen ? ["absolute", "relative"] : ["relative"]}
            w="100%"
            bg="purple.600"
            p="0.5em"
            color="white"
            fontSize="1.5em"
            boxShadow="xl"
            mb="5">
            {children}
        </Box>
    </>
}

function MobileMenuIcon({ isOpen, toggleMenu, toggleColorMode, colorMode }) {
    return <Flex display={["flex", "none"]}>
        <Button
            variant={isOpen ? "ghost" : "outline"}
            colorScheme="black"
            onClick={toggleMenu} >
            <CgMenu />
        </Button>
        <Spacer></Spacer>
        <Button onClick={toggleColorMode} variant="outline" colorScheme="black">
            {colorMode == "dark" ? <BsFillSunFill /> : <BsFillMoonStarsFill />}
        </Button>
    </Flex>
}

function MenuItem({ children, to, icon }) {
    return <Link as={NavLink} to={to}>
        <HStack>
            {icon}
            <Text>
                {children}
            </Text>
        </HStack>
    </Link>
}

import * as React from "react";
import { NavLink } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

