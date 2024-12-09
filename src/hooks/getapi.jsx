import axios from "axios";
import { useState } from "react";
import { useGiraf } from "../giraff";

const API_KEY = 'import.meta.env.VITE_API_KEY'
// const API_KEY = appConfig.api.API_KEY

function useGetApi() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { gHead, addGHead } = useGiraf();
    const headerConfig = { "x-api-key": API_KEY, Authorization: gHead.auth_token };

    const actionRequest = async ({ endPoint, params, hd }) => {
        setError(null);
        setData(null);
        setLoading(true);

        try {
            const response = await axios.get(endPoint, { params: params, headers: { ...headerConfig, ...hd } });
            const data = response.data;
            setData(data);
            setLoading(false);
            return data;
        } catch (err) {
            let errorMessage = err.response?.data.message || err.message;
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return { data, loading, error, actionRequest, setError, setData, setLoading };
}
export default useGetApi;
