const uuid = require('uuid').v4
const Router = require('@koa/router')
const router = new Router()

const REPLY_TIMEOUT_MS = 10000

const useWs = () => {

    const handlers = {}
    const clients = {}
    const replies = {}

    const checkAuth = (handlers) =>
        Object.entries(handlers)
            .map(([name, handler]) => [name, async (ctx, params) => {
                let decoded
                try {
                    decoded = await ctx.jwt.decodeToken(params.token)
                } catch (error) {
                    throw error
                }
                if (!decoded.user) {
                    throw new Error('No user in decoded token')
                }
                return await handler({
                    ...ctx,
                    user: decoded.user
                }, params)
            }])
            .reduce((acc, [name, handler]) => ({ ...acc, [name]: handler }), {})

    const addHandlers = (prefix, toAdd) =>
        Object.entries(toAdd).forEach(
            ([name, handler]) => handlers[`${prefix}.${name}`] = handler
        )

    addHandlers('device', checkAuth(require('./device')))

    const sendMessage = (ws, message) => ws.send(JSON.stringify(message))

    const handleOp = async (ctx, { id, op, params = {}, reply, value, error }) => {
        if (op === 'register') {
            clients[id] = ctx.websocket
            console.log(`Registered ${ctx.request.ip} with uid ${id}.`)
            return
        }
        if (op === 'reply' && replies[reply]) {
            replies[reply]({ value, error })
            return
        }
        const handler = handlers[op]
        if (!handler) {
            throw new Error(`No handler for op "${op}".`)
        }
        const result = await handler(ctx, params)
        if (reply) {
            sendMessage(ctx.websocket, {
                reply,
                op: 'reply',
                value: result
            })
        }
    }

    router.get('/ws', async (ctx, next) => {
        ctx.websocket.on('message', async (message) => {
            let parsed
            try {
                parsed = JSON.parse(message)
                if (!parsed.op) {
                    throw new Error('Received message with no op: ' + message)
                }
                await handleOp(ctx, parsed)
            } catch (err) {
                console.error(err)
            }
        })
        ctx.websocket.on('close', async () => {
            console.log('Disconnected', ctx.request.ip)
            Object.entries(clients).forEach(([id, client]) => {
                if (client === ctx.websocket) {
                    console.log(`Dropped ${ctx.request.ip} with uid ${id}.`)
                    delete clients[id]
                }
            })
        })
        await next()
    })

    const sendOp = (ws, op, params = {}) => new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            delete replies[id];
            reject(new Error('Timed out.'));
        }, REPLY_TIMEOUT_MS);
        const id = uuid();
        replies[id] = (message) => {
            clearTimeout(timeout);
            delete replies[id];
            if (message.value) {
                resolve(message.value);
            } else if (message.error) {
                reject(message.error);
            } else {
                reject(new Error(`Received incorrect reply for ${id}: ${JSON.stringify(message)}`));
            }
        };
        sendMessage(ws, {
            op,
            params,
            reply: id
        });
    })
    return { router, clients, sendOp }
}

module.exports = useWs