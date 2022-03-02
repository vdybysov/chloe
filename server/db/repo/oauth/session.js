const { ObjectId } = require('mongodb')
const useRepo = require('..')

const useOauthSessionRepo = (db) => {
    const { collection, insert } = useRepo(db, 'oauth.session')
    return {
        collection,
        createSession: ({ userId, authSessionUid }) => {
            return insert({ userId, authSessionUid })
        },
        getAndRemove: async (_id) => {
            const session = await collection.findOne({ _id: ObjectId(_id) })
            if (session) {
                await collection.deleteOne({ _id: session._id })
            }
            return session
        }
    }
}

module.exports = useOauthSessionRepo