const requestId = async (ctx, next) => {
    ctx.requestId = ctx.headers['x-request-id']
    await next()
}

module.exports = requestId