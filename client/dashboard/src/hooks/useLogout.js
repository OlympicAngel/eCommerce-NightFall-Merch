import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useToast } from "@chakra-ui/react";
import useMutationLogic from "./useMutationLogic";

function useLogout() {
    const { SERVER, setIsAuth } = useContext(AuthContext)
    const toast = useToast();

    //create an mutate function that when called it will trigger a logout request
    const { isSuccess, mutate } = useMutationLogic({
        urlPath: "users/managers/logout",
        method: "get",
        onSuccess: () => {
            setIsAuth(false)
        }
    })

    return { isSuccess, logout: mutate };
}
export default useLogout