import { useMutation } from "react-query"
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import axios from "axios";
import { toastError, toastSuccess } from "../utils/toast.helper";
import { useToast } from "@chakra-ui/react";


function useLogin() {
    const { SERVER, setIsAuth, setManager } = useContext(AuthContext)
    const toast = useToast()
    const url = SERVER + "users/managers/login";

    const { mutate, isLoading, error, isError } = useMutation({
        mutationFn: async (data) => await axios({
            "method": "post",
            url,
            data,
            withCredentials: true
        }),
        onError: (err) => {
            toastError(err, toast)
        },
        onSuccess: (res) => {
            setIsAuth(true)
            setManager(res.data.manager)
            toastSuccess(res.data.message, toast)
        }
    })

    return { mutate, isLoading, error, isError }
}
export default useLogin