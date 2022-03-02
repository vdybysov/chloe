const uuid = require('uuid').v4
const useRepo = require('..')

const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30

const useAuthSessionRepo = (db) => {
    const { collection, insert } = useRepo(db, 'auth.session')
    return {
        collection,
        createSession: async ({ userId }) => {
            const session = await insert({
                userId,
                uid: uuid(),
                expiresAt: new Date(Date.now() + SESSION_LIFETIME_SECONDS * 1000)
            })
            return session
        },
        getAndRemove: async (uid) => {
            const session = await collection.findOne({ uid })
            await collection.deleteOne({ _id: session._id })
            return session
        }
    }
}

module.exports = useAuthSessionRepo