const jwt = require('jsonwebtoken')

const useJwt = (secret) => {
    const decodeToken = (token) => new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                reject(error)
            } else {
                resolve(decoded)
            }
        })
    })
    
    const createToken = (payload, expiresIn) => new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })
    })

    return { createToken, decodeToken }
}

module.exports = useJwt