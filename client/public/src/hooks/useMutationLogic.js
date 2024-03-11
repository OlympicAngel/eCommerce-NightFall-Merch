import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { toastSuccess, toastError } from "../utils/toast.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult<AxiosResponse<any, any>, unknown, void, unknown>}
 */
function useMutationLogic({ urlPath, method, relatedQuery, onSuccess, preData }) {
    const toast = useToast()
    const { SERVER } = useContext(AuthContext)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async function (data) {
            let url;
            if (urlPath instanceof Function)
                url = urlPath(...arguments)
            else
                url = urlPath;

            return axios({
                "url": SERVER + url,
                method,
                data: preData || data,
                "withCredentials": true
            })
        },
        onError: (e) => toastError(e, toast),
        onSuccess: (res) => {
            toastSuccess(res.data.message, toast);

            if (relatedQuery)
                queryClient.invalidateQueries([`get${relatedQuery}`])
            if (onSuccess)
                onSuccess(res)
        }
    })
}


export default useMutationLogic