import { getContext, setContext } from "svelte"

export const setRest = () => {

    const baseUrl = import.meta.env.VITE_API_URL

    const handleResponse = (response) => {
        if (!response.ok) {
            throw response
        }
        return response.json()
    }

    const post = (url, body, config = {}) => {
        return fetch(baseUrl + url, {
            method: 'post',
            body,
            ...config
        }).then(handleResponse)
    }

    setContext('rest', { post })
}

export const useRest = () => getContext('rest')