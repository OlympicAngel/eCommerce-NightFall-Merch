import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import useMutationLogic from "./useMutationLogic";


function useLogin() {
    const { setIsAuth, setUser } = useContext(AuthContext)

    const { mutate, isLoading, error, isError } = useMutationLogic({
        urlPath: "users/login",
        method: "post",
        onSuccess: (res) => {
            setIsAuth(true)
            setUser(res.data.user)
        }
    })

    return { mutate, isLoading, error, isError }
}
export default useLogin