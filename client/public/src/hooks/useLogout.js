import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import useMutationLogic from "./useMutationLogic";

function useLogout() {
    const { setIsAuth } = useContext(AuthContext)

    //create an mutate function that when called it will trigger a logout request
    const { isSuccess, mutate } = useMutationLogic({
        urlPath: "users/logout",
        method: "get",
        onSuccess: () => {
            setIsAuth(false)
        }
    })

    return { isSuccess, logout: mutate };
}
export default useLogout