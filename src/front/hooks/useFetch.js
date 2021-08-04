import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useFetch(page) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [list, setList] = useState([]);

    const sendQuery = useCallback(async (page) => {
        try {
            await setLoading(true);
            await setError(false);
            
            const res = await axios.get(
                `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_APIPORT}/books/all/${page}`
            );
            await setList((prev) => [
                ...new Set([...prev, ...res.data])
            ]);
            setLoading(false);
        } catch (err) {
            setError(err);
        }
    }, [page]);

    useEffect(() => {
        sendQuery(page);
    }, [page, sendQuery]);

    return { loading, error, list };
}

export default useFetch;
