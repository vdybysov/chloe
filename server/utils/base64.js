const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
const decode = (str) => JSON.parse(Buffer.from(str, 'base64').toString())

module.exports = { encode, decode }