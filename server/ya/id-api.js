const axios = require('axios')
const FormData = require('form-data')

const OAUTH_BASE_URL = 'https://oauth.yandex.ru'
const INFO_BASE_URL = 'https://login.yandex.ru'

const useYaIdApi = ({ clientId, clientSecret }) => {

    const oauthClient = axios.create({
        baseURL: OAUTH_BASE_URL
    })

    const infoClient = axios.create({
        baseURL: INFO_BASE_URL
    })

    return {
        oauthUrl: (state) => OAUTH_BASE_URL + '/authorize?response_type=code&client_id=' + clientId + (state ? '&state=' + state : ''),
        token: async (code) => {
            const form = new FormData()
            form.append('grant_type', 'authorization_code')
            form.append('client_id', clientId)
            form.append('client_secret', clientSecret)
            form.append('code', code)
            const { data } = await oauthClient.post('/token', form, {
                headers: form.getHeaders()
            })
            return data
        },
        info: async (token) => {
            const { data } = await infoClient.get('/info?format=json', {
                headers: {
                    'Authorization': `OAuth ${token}`
                }
            })
            return data
        }
    }
}

module.exports = useYaIdApi