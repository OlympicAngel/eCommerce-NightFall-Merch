import { useContext } from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";


function useFetch(API, options) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState();

    const { requestReloadReq } = useContext(AuthContext)

    async function sendFetch() {
        //prevent multiple sends of the same requests
        if (isLoading)
            return;
        //reset error state
        if (isError)
            setIsError(false);

        let res;

        setIsLoading(true); //start loading state
        try {
            //send req
            res = await fetch(API, options)
            const data = await res.json();
            setData(data);
        } catch (e) {
            setIsError(e);
        }
        finally {
            setIsLoading(false); //stop loading state
            return res;
        }
    }

    useEffect(() => {
        sendFetch();
    }, [API, requestReloadReq])

    return { data, isError, isLoading, setData };
}


export default useFetch;