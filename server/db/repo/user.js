const { ObjectId } = require('mongodb')
const useRepo = require('./')

const useUserRepo = (db) => {
    const { collection, insert } = useRepo(db, 'user')
    return {
        collection,
        get: (_id) => collection.findOne({ _id: ObjectId(_id) }),
        getOrCreate: async ({ yaId, login, avatarId }) => {
            let user = await collection.findOne({ yaId })
            if (!user) {
                user = await insert({
                    yaId,
                    login,
                    avatarId
                })
            }
            return user
        }
    }
}

module.exports = useUserRepo