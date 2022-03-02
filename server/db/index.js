const { MongoClient } = require("mongodb")

const useMongo = async (connectionString) => {
    const client = new MongoClient(connectionString)
    await client.connect()
    return {
        db: client.db()
    }
}

module.exports = useMongo