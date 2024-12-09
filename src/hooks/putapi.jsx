import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useGiraf } from "../giraff";


const API_KEY = 'import.meta.env.VITE_API_KEY'

function usePutApi() {
    //   const { endPoint, params } = apiProps;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { gHead, addGHead } = useGiraf()
    const headerConfig = { "x-api-key": API_KEY, Authorization: gHead.auth_token }

    const actionRequest = async ({
        endPoint,
        params,
        ctype,
        hd
    }) => {
        const configType = ctype || "AUTH";
        setError(null);
        setData(null);
        setLoading(true);

        try {
            const { data: res } = await axios.put(endPoint, params, { headers: { ...headerConfig, ...hd } })
            setData(res)
            setLoading(false)
            return res
        } catch (err) {
            let errorMessage = err.response?.data.message || err.message
            console.log(errorMessage)
            if (!errorMessage) errorMessage = err.message
            setError(errorMessage);
            setLoading(false)

            throw new Error(errorMessage)

        }

    };
    return { data, loading, error, actionRequest, setError, setData, setLoading };
}
export default usePutApi;
