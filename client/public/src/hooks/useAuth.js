import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthProvider"
import { useQuery } from "react-query";
import axios from "axios";
import { toastError } from "../utils/toast.helper";
import { useToast } from "@chakra-ui/react";

function useAuth() {
    const { setIsAuth, SERVER, setUser } = useContext(AuthContext);
    const toast = useToast();

    const { isSuccess, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => await axios.get(SERVER + "users/auth", { withCredentials: true }),
        //prevent any form of refetch
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        select: (res) => res.data.user, //filter response data
        onSuccess: (user) => {
            setIsAuth(true)
            setUser(user) //save user details
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