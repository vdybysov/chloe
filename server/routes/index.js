const requestIdMw = require('../middleware/requestId')
const oauth = require('./oauth')
const v10 = require('./v1.0')
const Router = require('@koa/router')
const { koaSwagger } = require('koa2-swagger-ui')
const router = new Router()

router
    .use('/oauth', oauth.routes())
    .use(oauth.allowedMethods())
    .use('/v1.0', requestIdMw, v10.routes())
    .use(v10.allowedMethods())
    .get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec: {} } }))

module.exports = router