import { getContext, setContext } from "svelte";
import { derived, get, writable } from "svelte/store";
import useMPromise from "./mpromise";
import { useAuthRest } from "./rest/auth";
import jwt_decode from "jwt-decode"

export const setAuth = () => {

    const authRest = useAuthRest()

    const { get: refreshToken } = useMPromise(async () => {
        const { refresh_token, access_token, expires_in } =
            await authRest.token({ refresh_token: get(tokens)?.refresh_token });
        return {
            access_token,
            refresh_token,
            expires_at: new Date(Date.now() + expires_in * 1000),
        };
    })

    const tokens = writable(null)

    try {
        tokens.set(JSON.parse(localStorage.getItem('auth')))
    } catch (err) {
    }

    const user = derived(tokens, (t) => {
        const decoded = t?.access_token ? jwt_decode(t.access_token) : null
        return decoded?.user
    })

    const hasUser = derived(user, u => !!u)

    const getAccessToken = async () => {
        if (!get(tokens)?.access_token || new Date(get(tokens).expires_at) < new Date()) {
            if (get(tokens)?.refresh_token) {
                try {
                    setTokens(await refreshToken())
                } catch (error) {
                    if (error.name === 'Unauthorized' || error.name === 'Forbidden') {
                        tokens.set(null)
                        localStorage.removeItem('auth')
                    } else {
                        console.error(error)
                    }
                }
            } else {
                tokens.set(null)
            }
        }
        return get(tokens)?.access_token
    }

    const setTokens = (value) => {
        if (value?.refresh_token) {
            localStorage.setItem('auth', JSON.stringify({
                ...value,
                access_token: undefined
            }))
        } else {
            localStorage.removeItem('auth')
        }
        tokens.set(value)
    }

    const logout = () => {
        setTokens(null)
    }

    setContext("auth", {
        logout,
        user,
        hasUser,
        getAccessToken,
        setTokens
    })
}

export const useAuth = () => getContext("auth")