import { MdDynamicForm } from "react-icons/md";
import { SiLetsencrypt } from "react-icons/si";
import { BiLogInCircle } from "react-icons/bi";
import { MdOutlineLockReset } from "react-icons/md";
import { Avatar, Box, Button, Card, Flex, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import LoginForm from "../components/forms/LoginForm.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import ResetPasswordForm from "../components/forms/ResetPasswordForm.jsx";
import ResetPinsForm from "../components/forms/ResetPinsForm.jsx";
import Dialog from "../components/partial/Dialog.jsx";
import useMutationLogic from "../hooks/useMutationLogic.js";
import Loader from "../components/partial/Loader.jsx";
import ManagerForm from "../components/forms/ManagerForm.jsx";

function Login() {
    useTitle("התחברות משתמש")

    const { isAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuth)
            navigate("/");
    }, [isAuth])

    const [page, setPage] = useState("login") //login reset pins
    const [email, setEmail] = useState();

    return <Card boxShadow="2xl" bg={{ login: "gray.700", reset: "purple.900", pins: "blue.900" }[page]}>

        <Flex flexDirection={["column", "row"]} alignItems={"center"} p={"3em"} gap={"2em"} position={"relative"}>
            {page == "login" && <LoginView setPage={setPage} />}
            {page == "reset" && <ResetView setPage={setPage} setEmail={setEmail} email={email} />}
            {page == "pins" && <PinView setPage={setPage} email={email} />}
        </Flex>

    </Card>

}
export default Login

function LoginView({ setPage }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutate: checkIsInitialized, isLoading } = useMutationLogic({
        "urlPath": "users/managers/initialize/check",
        "onSuccess": () => {
            onOpen()
        },
    })

    return <>
        <Box position={"absolute"} margin={3} zIndex={2} inset={0} w={"min-content"} h={"min-content"}>
            <Button variant="ghost" cursor={"pointer"} w={"auto"}
                fontSize={"4.5em"} color="rgba(255,255,255,0.5)" _hover={{ color: "lightpink" }}
                outline="solid 1px color-mix(in srgb,currentColor, transparent 80%)" padding={"0 0.15em"}
                onClick={() => { !isLoading && checkIsInitialized() }}
            >
                {isLoading && <Loader size={"xs"} thickness="0.1em" /> || <MdDynamicForm size={"0.5em"} />}
            </Button>
        </Box>
        <Dialog {... {
            isOpen, onOpen, onClose,
            config: { hasForm: true, header: "" }
        }}>
            <ManagerForm onClose={onClose} alternateUrl="users/managers/initialize" />
        </Dialog>

        <Avatar size='2xl'>
        </Avatar>
        <VStack>
            <LoginForm></LoginForm>
            <Text color="blue.200" cursor={"pointer"} _hover={{ color: "blue.400", fontWeight: 700 }}
                onClick={() => setPage("reset")}>שחכת סיסמה?</Text>
        </VStack>
    </>
}

function ResetView({ setPage, setEmail, email }) {
    return <>
        <Box>
            <HStack w={"min-content"} color="gray.300" cursor={"pointer"} _hover={{ color: "blue.400" }}
                onClick={() => setPage("login")}>
                <BiLogInCircle size={"1.5em"} />
                <Text>חזור</Text>
            </HStack>
            <Text as={MdOutlineLockReset} fontSize={"calc(10vmax + 15vmin)"} color="purple.300" />

        </Box>
        <VStack>
            <ResetPasswordForm setPage={setPage} setEmail={setEmail} email={email}></ResetPasswordForm>
            <Text color="blue.200" cursor={"pointer"} _hover={{ color: "blue.400", fontWeight: 700 }}
                onClick={() => setPage("pins")}>יש כבר קוד איפוס?</Text>
        </VStack>
    </>
}

function PinView({ setPage }) {

    return <>
        <Box>
            <HStack w={"min-content"} color="gray.300" cursor={"pointer"} _hover={{ color: "blue.400" }}
                onClick={() => setPage("reset")}>
                <MdOutlineLockReset size={"1.5em"} />
                <Text>חזור</Text>
            </HStack>
            <Text as={SiLetsencrypt} fontSize={"calc(10vmax + 15vmin)"} color="blue.200" />

        </Box>

        <VStack>
            <ResetPinsForm setPage={setPage}></ResetPinsForm>
            <Text color="blue.200" cursor={"pointer"} _hover={{ color: "blue.400", fontWeight: 700 }}
                onClick={() => setPage("reset")}>לא קיבלת קוד?</Text>
        </VStack>

    </>
}