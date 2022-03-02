const auth = async (ctx, next) => {
    const token = ctx.headers['authorization']?.split('Bearer ')[1]
    if (!token) {
        throw { status: 401 }
    }
    try {
        const decoded = await ctx.jwt.decodeToken(token)
        ctx.user = decoded.user
        if (!ctx.user?.id) {
            throw { status: 401 }
        }
    } catch (err) {
        throw { status: 401 }
    }
    await next()
}

module.exports = auth