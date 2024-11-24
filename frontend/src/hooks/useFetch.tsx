import axios from "axios"
import { useEffect, useState } from "react"

export function useFetch(url: string, auth: boolean = true) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if(auth === true){
                    const response = await axios.get(url, { withCredentials: true })
                    if (response) {
                        setData(response.data.data)
                    } else {
                        setError(response.data.error.message)
                    }
                } else {
                    const response = await axios.get(url)
                    if (response) {
                        setData(response.data.data)
                    } else {
                        setError(response.data.error.message)
                    }
                }
                
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url, auth])
    return { data, loading, error }
}