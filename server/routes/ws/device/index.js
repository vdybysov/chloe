const { ObjectId } = require('mongodb')

const uuid = require('uuid').v4

module.exports = {
    list: async ({ ws, user, repos }) => {
        return (await repos.device.getByUserId(user.id))
            .map(device => ({
                ...device,
                state: ws.clients[device.uid] ? 'online' : 'offline'
            }))
    },
    get: async ({ user, repos }, { id }) => {
        const device = await repos.device.get(id)
        if (!device) {
            throw { status: 404 }
        }
        if (!device.userId.equals(user.id)) {
            throw { status: 403 }
        }
        return device
    },
    remove: async ({ user, repos }, { id }) => {
        const device = await repos.device.get(id)
        if (!device) {
            throw { status: 404 }
        }
        if (!device.userId.equals(user.id)) {
            throw { status: 403 }
        }
        await repos.device.remove(id)
        return {}
    },
    save: async ({ user, repos }, { device, }) => {
        if (device._id) {
            const existing = await repos.device.get(device._id)
            if (!existing.userId || !existing.userId.equals(user.id)) {
                throw { status: 403 }
            }
            device.uid = existing.uid
        }
        if (!device.type) {
            throw { error: 'NoType' }
        }
        if (!device.name) {
            throw { error: 'NoName' }
        }
        if (!device.uid) {
            device.uid = uuid()
        }
        device.userId = ObjectId(user.id)
        device.state = device.state || 'offline'
        return repos.device.save(device)
    }
}