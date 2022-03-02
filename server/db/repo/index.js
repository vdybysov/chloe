const { ObjectId } = require("mongodb")

const useRepo = (db, collectionName) => {
    const collection = db.collection(collectionName)
    const insert = async (doc) => {
        const { insertedId } = await collection.insertOne(doc)
        return collection.findOne({ _id: insertedId })
    }
    return {
        collection,
        insert,
        save: async (doc) => {
            const query = { _id: ObjectId(doc._id) }
            if (doc._id && await collection.countDocuments(query)) {
                const { _id, ...replacement } = doc
                await collection.replaceOne(query, replacement)
                return collection.findOne(query)
            } else {
                return insert(doc)
            }
        }
    }
}

module.exports = useRepo