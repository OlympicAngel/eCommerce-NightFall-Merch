import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthProvider"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

/**
 * 
 * @returns {import("@tanstack/react-query").UseQueryResult<any, unknown>}
 */
export function useQueryLogic({ key, urlPath, select, extra = {} }) {
    const { SERVER } = useContext(AuthContext)

    //allow single key or mutiple
    let keys = [];
    if (key instanceof Array) {
        keys = [...key];
        keys[0] = "get" + keys[0];
    }
    else
        keys.push(`get${key}`)

    //cancel signal when component dismount (used if request hasn't completed yet)
    const controller = new AbortController();

    const res = useQuery({
        queryKey: keys,
        queryFn: async () => axios.get(SERVER + urlPath, { withCredentials: true, signal: controller.signal }),
        select: (res) => select ? select(res) : res.data[key.split("_")[0]],
        staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
        refetchInterval: 1000 * 60,
        retry: 0,
        ...extra
    })

    useEffect(() => {
        return () => res.isLoading && controller.abort()
    }, [])

    return res;
}

export default useQueryLogic