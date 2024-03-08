import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthProvider"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toastError } from "../utils/toast.helper";
import { useToast } from "@chakra-ui/react";

function useAuth() {
    const { setIsAuth, SERVER, setManager } = useContext(AuthContext);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true)

    const { isSuccess } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => await axios.get(SERVER + "users/managers/auth", { withCredentials: true }),
        //prevent any form of refetch
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        select: (res) => res.data.manager, //filter response data
        onSuccess: (manager) => {
            setManager(manager) //save manager details
            setIsAuth(true)
            setIsLoading(false)
        },
        onError: (e) => {
            setIsAuth(false)
            if (e.response.data.timeout)
                toastError(e, toast)
            setIsLoading(false)
        }
    })

    return { isLoading, isSuccess }
}
export default useAuth