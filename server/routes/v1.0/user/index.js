const devices = require('./devices')
const Router = require('@koa/router')
const router = new Router()

router
    .use('/devices', devices.routes())
    .use(devices.allowedMethods())

router.post('/unlink', ctx => {
    console.log(`Unlinking ${ctx.userId}`)
    ctx.body = { request_id: ctx.requestId }
})

module.exports = router