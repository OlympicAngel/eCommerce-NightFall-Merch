import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider"
import { useQuery } from "react-query"
import axios from "axios"

/**
 * 
 * @returns {UseQueryResult<any, unknown>}
 */
export function useCategories() {
    const { SERVER } = useContext(AuthContext)

    return useQuery({
        queryKey: "getCategories",
        queryFn: async () => axios.get(SERVER + "categories"),
        select: (res) => res.data.categories,
        staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
        refetchInterval: 1000 * 60,
        retry: 0
    })
}

export default useCategories