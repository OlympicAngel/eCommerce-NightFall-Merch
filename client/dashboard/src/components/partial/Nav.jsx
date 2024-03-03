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
    const [isOpen, setIsOpen] = useState(true)
    function toggleMenu() { setIsOpen(!isOpen) }
    function closeMenu() { setIsOpen(false) }

    //get menu height for smooth animation using max height
    const [menuH, setMenuH] = useState(0)
    const [updateMenuH, setUpdateMenuH] = useState(false)
    const ref = useRef(null)
    useEffect(() => {
        const h = ref.current.clientHeight;
        setIsOpen(false)
        if (h != 0)
            setMenuH(h)

    }, [updateMenuH])
    useEffect(() => {
        let timeoutID;
        //listen to resize changes
        window.addEventListener("resize", () => {
            clearTimeout(timeoutID)
            //set a timeout to prevent spaming the use effect
            timeoutID = setTimeout(() => {
                setMenuH(0) //set the size to its normal size
                setIsOpen(true) //open menu
                setUpdateMenuH(Math.random()) //trigger an use effect update (will close the menu)
            }, 350);
        }, false)
    }, [])

    return (<>
        <Box onClick={closeMenu} display={["block", "none"]} position={"absolute"} inset="0" zIndex={1} backdropFilter={"blur(0.2em)"}
            opacity={isOpen ? 1 : 0} pointerEvents={isOpen ? "all" : "none"} transition={"opacity 0.3s"} cursor={"no-drop"}
            _after={{ content: '""', inset: 0, bg: "purple.900", position: "absolute", opacity: 0.5 }} ></Box>

        <NavContainer isOpen={isOpen} zIndex={2} fontSize={["2xl", "xs", "lg", "xl"]}>
            <MobileMenuIcon {...{ toggleColorMode, colorMode, toggleMenu, isOpen }} />
            <Flex ref={ref} as="nav" w="max-content"
                width={["auto", "100%"]}
                display={"flex"}
                gap={[0, "3vmin"]}
                flexDirection={["column", "row"]}
                align="center"
                overflow={"hidden"}
                maxHeight={isOpen ? [menuH || "initial", "initial"] : [0, "initial"]} pointerEvents={isOpen ? ["all", "all"] : ["none", "all"]} transition={"max-height 0.3s"}
            >

                <MenuItem to="/" icon={<AiFillHome />} closeMenu={closeMenu}> ראשי</MenuItem>
                <MenuItem to="/orders" icon={<BsCardChecklist />} closeMenu={closeMenu}>  הזמנות</MenuItem>
                <MenuItem to="/products" icon={<AiFillShop />} closeMenu={closeMenu}> מוצרים</MenuItem>
                <MenuItem to="/categories" icon={<TbTableOptions />} closeMenu={closeMenu}> קטגוריות</MenuItem>

                <Spacer display={["none", "block"]} minH={"1em"} />
                <Flex gap={"0.5em"} mt={["1em", 0]}>
                    <Button display={["none", "block"]} onClick={toggleColorMode} variant="outline" colorScheme="black">
                        {colorMode == "dark" ? <BsFillSunFill /> : <BsFillMoonStarsFill />}
                    </Button>
                    <Button onClick={() => { logout() }} colorScheme="gray">
                        <TbLogout size={"1.7em"} /><Text display={["block", "none"]} ps={"1em"}>התנתק</Text>
                    </Button>
                </Flex>
            </Flex>
        </NavContainer>
    </>
    )
}

function NavContainer({ children, isOpen, zIndex, fontSize }) {
    return <>
        <Box top="0"
            zIndex={zIndex}
            position={["absolute", "relative"]}
            w="100%"
            bg="purple.600"
            p="0.5em"
            color="white"
            boxShadow="xl"
            fontSize={fontSize}>
            {children}
        </Box>
    </>
}

function MobileMenuIcon({ isOpen, toggleMenu, toggleColorMode, colorMode }) {
    return <Flex display={["flex", "none"]} fontSize={["4xl", "xs", "sm", "lg"]}>
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

function MenuItem({ children, to, icon, closeMenu }) {
    return <Link as={NavLink} to={to} onClick={closeMenu}>
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
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

