import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import useMutationLogic from "./useMutationLogic";


function useLogin() {
    const { setIsAuth, setManager } = useContext(AuthContext)

    const { mutate, isLoading, error, isError } = useMutationLogic({
        urlPath: "users/managers/login",
        method: "post",
        onSuccess: (res) => {
            setIsAuth(true)
            setManager(res.data.manager)
        }
    })

    return { mutate, isLoading, error, isError }
}
export default useLogin