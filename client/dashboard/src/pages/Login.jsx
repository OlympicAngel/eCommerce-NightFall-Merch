import { Avatar, Card, Divider, Flex } from "@chakra-ui/react"
import LoginForm from "../components/forms/LoginForm.jsx"
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthProvider.jsx"
import { Navigate, useNavigate } from "react-router-dom"

function Login() {
    const { isAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuth)
            navigate("/");
    }, [isAuth])

    return <Card boxShadow="2xl">
        <Flex flexDirection={["column", "row"]} alignItems={"center"} p={"3em"} gap={"2em"}>
            <Avatar size='2xl'></Avatar>
            <LoginForm></LoginForm>
        </Flex>
    </Card>

}
export default Login