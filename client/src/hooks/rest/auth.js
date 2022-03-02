import { useRest } from "."

export const useAuthRest = () => {

    const rest = useRest()

    return {
        token: ({ refresh_token, code }) => {
            let body
            if(refresh_token) {
                body = `grant_type=refresh_token&refresh_token=${refresh_token}`
            } else if(code) {
                body = `grant_type=authorization_code&code=${code}`
            } else {
                throw new Error('refresh_token or code must be providen')
            }
            return rest.post('/oauth/token', body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
        }
    }
}