import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

/**
 * 
 * @returns {import("@tanstack/react-query").UseQueryResult<any, unknown>}
 */
export function useQueryLogic({ key, urlPath, select }) {
    const { SERVER } = useContext(AuthContext)

    //allow single key or mutiple
    let keys = [];
    if (key instanceof Array) {
        keys = [...key];
        keys[0] = "get" + keys[0];
    }
    else
        keys.push(`get${key}`)

    return useQuery({
        queryKey: keys,
        queryFn: async () => axios.get(SERVER + urlPath, { withCredentials: true }),
        select: (res) => select ? select(res) : res.data[key],
        staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
        refetchInterval: 1000 * 60,
        retry: 0
    })
}

export default useQueryLogic