const dotenv = require('dotenv')
const router = require('./routes')
const useUserRepo = require('./db/repo/user')
const useOauthSessionRepo = require('./db/repo/oauth/session')
const useAuthSessionRepo = require('./db/repo/auth/session')
const useJwt = require('./jwt')
const Koa = require('koa')
const websockify = require('koa-websocket')
const cors = require('@koa/cors');
const app = new Koa()
const useWs = require('./routes/ws')
const useDeviceRepo = require('./db/repo/device')

websockify(app)

dotenv.config()

const init = async () => {

    const yaIdApi = require('./ya/id-api')({
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET
    })

    const { db } = await require('./db')(process.env.MONGO_CS)

    const repos = {
        user: useUserRepo(db),
        auth: {
            session: useAuthSessionRepo(db)
        },
        oauth: {
            session: useOauthSessionRepo(db)
        },
        device: useDeviceRepo(db)
    }

    const jwt = useJwt(process.env.JWT_SECRET)
    const ws = useWs(jwt)

    app
        .use(cors())
        .use(async (ctx, next) => {
            await next();
            const rt = ctx.response.get('X-Response-Time');
            console.log(`${ctx.status} ${ctx.method} ${ctx.url} - ${rt} ${JSON.stringify(ctx.body)}`);
        })
        .use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        })
        .use(async (ctx, next) => {
            ctx.yaIdApi = yaIdApi
            ctx.repos = repos
            ctx.jwt = jwt
            ctx.ws = ws
            await next()
        })
        .use(async (ctx, next) => {
            try {
                await next()
            } catch (err) {
                if (err.status) {
                    ctx.status = err.status
                }
                if (err.error) {
                    ctx.body = { error: err.error }
                } else if (typeof err === 'string') {
                    ctx.body = { error: err }
                    ctx.status = 400
                } else if (!err.status) {
                    throw err
                }
            }
        })
        .use(router.routes())
        .use(router.allowedMethods())

    app.ws
        .use(async (ctx, next) => {
            ctx.yaIdApi = yaIdApi
            ctx.repos = repos
            ctx.jwt = jwt
            ctx.ws = ws
            await next()
        })
        .use(ws.router.routes())
        .use(ws.router.allowedMethods())

    const port = process.env.PORT || 4000

    await app.listen(port)

    console.log(`Server listening on http://localhost:${port}`)
}

init()