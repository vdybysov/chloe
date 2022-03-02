const { ObjectId } = require('mongodb')
const useRepo = require('./')

const useDeviceRepo = (db) => {
    const { collection, save } = useRepo(db, 'device')
    return {
        collection,
        get: (_id) => collection.findOne({ _id: ObjectId(_id) }),
        remove: (_id) => collection.deleteOne({ _id: ObjectId(_id) }),
        getByUserId: (userId, uids = []) => collection.find({
            userId: ObjectId(userId), 
            ...(uids.length ? { uid: { $in: uids } } : {})
        }).toArray(),
        save
    }
}

module.exports = useDeviceRepo