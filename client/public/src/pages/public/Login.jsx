import { SiLetsencrypt } from "react-icons/si";
import { BiLogInCircle } from "react-icons/bi";
import { MdOutlineLockReset } from "react-icons/md";
import { Avatar, Box, Button, Card, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import ResetPasswordForm from "../../components/forms/ResetPasswordForm.jsx";
import ResetPinsForm from "../../components/forms/ResetPinsForm.jsx";
import LoginForm from "../../components/forms/LoginForm.jsx";

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

  return <Card boxShadow="2xl" w={"auto"} bg={{ login: "gray", reset: "bgPurple", pins: "bgBlue" }[page]}>

    <Flex flexDirection={["column", "row"]} alignItems={"center"} p={"3em"} gap={"2em"}>
      {page == "login" && <LoginView setPage={setPage} />}
      {page == "reset" && <ResetView setPage={setPage} setEmail={setEmail} email={email} />}
      {page == "pins" && <PinView setPage={setPage} email={email} />}
    </Flex>
    <Button as={Link} fontSize={"1.5em"} colorScheme="blue" className="button" to={"/register"}>עדיין לא רשום?</Button>
  </Card>

}
export default Login

function LoginView({ setPage }) {
  return <>
    <Avatar w={"calc(8vmax + 8vmin)"} h={"calc(8vmax + 8vmin)"}>
    </Avatar>
    <VStack>
      <LoginForm></LoginForm>
      <Text color="blue.200" cursor={"pointer"} fontWeight={700} _hover={{ color: "blue.300" }}
        onClick={() => setPage("reset")}>שחכת סיסמה?</Text>
    </VStack>
  </>
}

function ResetView({ setPage, setEmail, email }) {
  return <>
    <Box>
      <HStack w={"min-content"} color="blackWhite" cursor={"pointer"} _hover={{ color: "blue.300" }}
        onClick={() => setPage("login")}>
        <BiLogInCircle size={"1.5em"} />
        <Text>חזור</Text>
      </HStack>
      <Text as={MdOutlineLockReset} fontSize={"calc(10vmax + 10vmin)"} color="purple.300" />

    </Box>
    <VStack>
      <ResetPasswordForm setPage={setPage} setEmail={setEmail} email={email}></ResetPasswordForm>
      <Text color="blue.200" fontWeight={700} cursor={"pointer"} _hover={{ color: "blue.300" }}
        onClick={() => setPage("pins")}>יש כבר קוד איפוס?</Text>
    </VStack>
  </>
}

function PinView({ setPage }) {

  return <>
    <Box>
      <HStack w={"min-content"} color="blackWhite" cursor={"pointer"} _hover={{ color: "blue.300" }}
        onClick={() => setPage("reset")}>
        <MdOutlineLockReset size={"1.5em"} />
        <Text>חזור</Text>
      </HStack>
      <Text as={SiLetsencrypt} fontSize={"calc(10vmax + 10vmin)"} color="green.300" />

    </Box>

    <VStack>
      <ResetPinsForm setPage={setPage}></ResetPinsForm>
      <Text color="blue.200" fontWeight={700} cursor={"pointer"} _hover={{ color: "blue.300" }}
        onClick={() => setPage("reset")}>לא קיבלת קוד?</Text>
    </VStack>

  </>
}