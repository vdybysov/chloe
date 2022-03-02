const authMw = require('../../middleware/auth')
const user = require('./user')
const Router = require('@koa/router')
const router = new Router()

router
    .use('/user', authMw, user.routes())
    .use(user.allowedMethods())

router.head('/', ctx => {
    ctx.body = ''
})

module.exports = router