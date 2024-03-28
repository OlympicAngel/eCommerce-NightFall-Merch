import { FaUserCircle } from "react-icons/fa";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { CgMenu } from "react-icons/cg";
import { AiFillHome } from "react-icons/ai";
import { Flex, Link, Box, Button, Text, HStack, useColorMode, Spacer, Tooltip } from "@chakra-ui/react";

if (!localStorage["chakra-ui-color-mode"])
    localStorage["chakra-ui-color-mode"] = "dark"

export default function Nav() {
    const [isOpen, setIsOpen] = useState(true)
    function toggleMenu() { setIsOpen(!isOpen) }
    function closeMenu() { setIsOpen(false) }
    const { isAuth, user } = useContext(AuthContext)

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
        <Box onClick={closeMenu} display={["block", "none"]} position={"absolute"} inset="0" zIndex={2} backdropFilter={"blur(0.2em)"}
            opacity={isOpen ? 1 : 0} pointerEvents={isOpen ? "all" : "none"} transition={"opacity 0.3s"} transitionDelay={(~~!isOpen) * 0.2 + "s"}
            cursor={"no-drop"} _after={{ content: '""', inset: 0, bg: "purple.900", position: "absolute", opacity: 0.5, zIndex: 2 }} >
        </Box>

        <NavContainer isOpen={isOpen} zIndex={3} fontSize={["2xl", "xs", "lg", "xl"]}>
            <MobileMenuIcon {...{ toggleMenu, isOpen }} />
            <Flex ref={ref} as="nav" w="max-content"
                width={["auto", "100%"]}
                display={"flex"}
                gap={[0, "3vmin"]}
                flexDirection={["column", "row"]}
                alignItems={["stretch", "center"]}
                overflow={"hidden"}
                mt={[isOpen ? "0.5em" : 0, 0]}
                maxHeight={isOpen ? [menuH || "initial", "initial"] : [0, "initial"]} pointerEvents={isOpen ? ["all", "all"] : ["none", "all"]}
                transition={"max-height 0.3s, margin-Top 0.3s"} transitionDelay={(~~!isOpen) * 0.2 + "s"}
            >

                <MenuItem to="/" icon={<AiFillHome size={"1.2em"} />} {...{ closeMenu }}> ראשי</MenuItem>
                <MenuItem to="/random" reloadDocument icon={<GiPerspectiveDiceSixFacesRandom size={"1.5em"} />} {...{ closeMenu }}>מוצר אקראי</MenuItem>
                <MenuItem to="/about" icon={<HiInformationCircle size={"1.2em"} />} {...{ closeMenu }}> עלינו</MenuItem>
                {isAuth && <MenuItem to="/profile" icon={<FaUserCircle size={"1.2em"} />} {...{ closeMenu }}> פרופיל</MenuItem>}


                <Spacer display={["none", "block"]} minH={"1em"} />
                <SideButtons toggleMenu={toggleMenu} />
            </Flex>
            {isAuth &&
                <Box bg="bg" position={"absolute"} p={"0 0.5em "} borderRadius={"0 0 0.5em 0.5em"}
                    boxShadow={"md"} bottom={"1px"} transform={"translateY(100%)"} zIndex={-2}
                >ברוך הבא,
                    {user.name} |<Link as={NavLink} alt="פרופיל משתמש" to="/profile" fontSize={"0.75em"} opacity={"0.7"} ms={"0.5em"}>פרופיל</Link>
                </Box>
            }
        </NavContainer>

    </>
    )
}

function NavContainer({ children, isOpen, zIndex, fontSize }) {
    return <Box top="0"
        zIndex={zIndex}
        position={["absolute", "relative"]}
        w="100%"
        bg="bg"
        p="0.5em"
        boxShadow="2xl"
        fontSize={fontSize}>
        {children}
    </Box>
}

function MobileMenuIcon({ isOpen, toggleMenu }) {
    const { colorMode, toggleColorMode } = useColorMode();

    return <Flex display={["flex", "none"]} fontSize={["4xl", "xs", "sm", "lg"]}>
        <Button
            variant={"outline"}
            colorScheme={isOpen ? "red" : ""}
            onClick={toggleMenu} >
            <CgMenu />
        </Button>
        <Spacer></Spacer>
        <Button onClick={toggleColorMode} variant="outline" colorScheme="aqua" p={0}>
            {colorMode == "dark" ? <BsFillSunFill fontSize={"1.5em"} /> : <BsFillMoonStarsFill fontSize={"1.5em"} />}
        </Button>
    </Flex>
}

function MenuItem({ children, to, reloadDocument, icon, closeMenu }) {

    const active = {
        color: "gold",
        fontWeight: 900,
        background: "black",
        svg: {
            color: "red"
        }
    };

    return <Link style={({ isActive }) => isActive ? active : {}} reloadDocument={reloadDocument}
        borderRadius={"0.5em"} transition={"0.3s background, 0.3s color"}
        color="high.blue" fontWeight={900}
        as={NavLink} to={to} onClick={closeMenu} p="0.2em 0.5em">
        <HStack>
            {icon}
            <Text whiteSpace={"nowrap"}>
                {children}
            </Text>
        </HStack>
    </Link>
}

function SideButtons({ toggleMenu }) {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    const { logout } = useLogout()

    const isDarkMode = colorMode == "dark";

    function onLoginClick() {
        if (isAuth)
            logout();
        else
            navigate("/login")
        toggleMenu()

    }

    return <Flex gap={"0.5em"} mt={["1em", 0]} justifyContent={"left"}>
        <Tooltip label={isDarkMode ? "פלאש באנג" : "דרק מוד"}>
            <Button onClick={toggleColorMode} display={["none", "inline-flex"]} variant="outline" colorScheme="aqua" p={0}>
                {isDarkMode ? <BsFillSunFill size={"1.5em"} /> : <BsFillMoonStarsFill size={"1.5em"} />}
            </Button>
        </Tooltip>
        <Tooltip label={isAuth ? "התנתק" : "התחבר"}>
            <Button onClick={() => { onLoginClick() }} variant={"outline"} colorScheme={isAuth ? "gray" : "green"} bg={isAuth ? "" : "bgGreen"} p={["1em", 0]}>
                {isAuth
                    && <><IoMdLogOut size={"1.5em"} /><AiOutlineUser size={"1.5em"} /><Text display={["block", "none"]} ps={"1em"}>התנתק</Text></>
                    || <><IoMdLogIn size={"1.5em"} /><AiOutlineUser size={"1.5em"} /><Text display={["block", "none"]} ps={"1em"}>התחבר</Text></>
                }
            </Button>
        </Tooltip>
    </Flex>
}

import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

