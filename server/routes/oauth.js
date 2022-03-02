const Base64 = require('../utils/base64')
const Router = require('@koa/router')
const koaBody = require('koa-body')

const AUTH_TOKEN_LIFETIME_SECONDS = 60 * 30

const router = new Router()

router.get('/authorize', ctx => {
    const { client_id, redirect_uri, state } = ctx.query
    ctx.redirect(ctx.yaIdApi.oauthUrl(Base64.encode({
        redirect_uri,
        state
    })))
})

router.get('/redirect', async (ctx) => {
    const { redirect_uri, state } = ctx.query.state ? Base64.decode(ctx.query.state) : {}
    const { access_token } = await ctx.yaIdApi.token(ctx.query.code)
    const info = await ctx.yaIdApi.info(access_token)
    const user = await ctx.repos.user.getOrCreate({
        yaId: info.id,
        login: info.login,
        avatarId: info.default_avatar_id
    })
    const authSession = await ctx.repos.auth.session.createSession({
        userId: user._id
    })
    const oauthSession = await ctx.repos.oauth.session.createSession({
        userId: user._id,
        authSessionUid: authSession.uid
    })
    ctx.redirect(redirect_uri + '?code=' + oauthSession._id + (state ? '&state=' + state : ''))
})

router.post('/token', koaBody(), async ctx => {
    const { grant_type, refresh_token, code } = ctx.request.body
    if (grant_type === 'authorization_code') {
        const session = await ctx.repos.oauth.session.getAndRemove(code)
        if (!session) {
            throw { status: 401 }
        }
        ctx.body = await createAccessToken(ctx, session.userId, session.authSessionUid)
    } else if (grant_type === 'refresh_token') {
        let session = await ctx.repos.auth.session.getAndRemove(refresh_token)
        if (!session || session.expiresAt < new Date()) {
            throw { status: 401 }
        }
        session = await ctx.repos.auth.session.createSession({
            userId: session.userId
        })
        ctx.body = await createAccessToken(ctx, session.userId, session.uid)
    } else {
        throw 'InvalidGrantType'
    }
})

const createAccessToken = async (ctx, userId, authSessionUid) => {
    const user = await ctx.repos.user.get(userId)
    if (!user) {
        throw { error: 'NoUser' }
    }
    return {
        access_token: await ctx.jwt.createToken({
            user: {
                id: user._id.toString(),
                ydId: user.yaId,
                login: user.login,
                avatarId: user.avatarId
            }
        }, AUTH_TOKEN_LIFETIME_SECONDS),
        token_type: 'bearer',
        expires_in: AUTH_TOKEN_LIFETIME_SECONDS,
        refresh_token: authSessionUid
    }
}

module.exports = router