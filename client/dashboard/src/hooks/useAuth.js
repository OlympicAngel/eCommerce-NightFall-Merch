import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthProvider"
import { useQuery } from "react-query";
import axios from "axios";
import { toastError } from "../utils/toast.helper";
import { useToast } from "@chakra-ui/react";

function useAuth() {
    const { setIsAuth, SERVER, setManager } = useContext(AuthContext);
    const toast = useToast();

    const { isSuccess, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => await axios.get(SERVER + "users/managers/auth", { withCredentials: true }),
        //prevent any form of refetch
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        select: (res) => res.data.manager, //filter response data
        onSuccess: (manager) => {
            setIsAuth(true)
            setManager(manager) //save manager details
        },
        onError: (e) => {
            setIsAuth(false)
            if (e.response.data.timeout)
                toastError(e, toast)
        }
    })

    return { isLoading, isSuccess }
}
export default useAuth