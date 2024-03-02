import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "../context/AuthProvider";
import { toastSuccess } from "../utils/toast.helper";
import { useToast } from "@chakra-ui/react";

function useLogout() {
    const { SERVER, setIsAuth } = useContext(AuthContext)
    const toast = useToast();

    //create an mutate function that when called it will trigger a logout request
    const { isSuccess, mutate } = useMutation({
        mutationFn: async () => await axios.get(SERVER + "users/managers/logout", { withCredentials: true }),
        onError: (err) => {
            toastError(err, toast)
        },
        onSuccess: (res) => {
            setIsAuth(false)
            toastSuccess(res.data.message, toast)
        }
    })
    return { isSuccess, logout: mutate };
}
export default useLogout