const koaBody = require('koa-body')
const Router = require('@koa/router')
const router = new Router()

const mapDeviceType = type => `devices.types.${type}`
const mapCapabilityType = type => `devices.capabilities.${type}`

const ensureState = capability => {
    if (!capability.state) {
        switch (capability.type) {
            case 'on_off':
                capability.state = {
                    instance: 'on',
                    value: false
                }
                break
            case 'range':
                capability.state = {
                    instance: capability.parameters.instance,
                    value: capability.parameters.range.min
                }
                break
            case 'mode':
                capability.state = {
                    instance: capability.parameters.instance,
                    value: capability.parameters.modes[0].value
                }
                break
            case 'color_setting':
                const [instance, value] = ['temperature_k', 'color_model', 'color_scene']
                    .map(key => [key, capability.parameters[key]])
                    .filter(([_, value]) => value)[0]
                capability.state = {
                    instance,
                    value: value.min || value.scenes?.[0].id || 'rgb'
                }
                break
            case 'toggle':
                capability.state = {
                    instance: capability.parameters.instance,
                    value: false
                }
                break
        }
    }
}

const getUserDevices = async (ctx, uids = [], needCapabilityStates = false, dropCapabilitiesParameters = false) => (await ctx.repos.device.getByUserId(ctx.user.id, uids))
    .map(device => {
        if (needCapabilityStates) {
            device.capabilities.forEach(ensureState)
        }
        if (dropCapabilitiesParameters) {
            device.capabilities.forEach(capability => delete capability.parameters)
        }
        return device
    })
    .map(({ state, userId, _id, uid, ...device }) => {
        return {
            ...device,
            id: uid,
            type: mapDeviceType(device.type),
            capabilities: (device.capabilities || []).map(({ type, ...capability }) => ({
                ...capability,
                type: mapCapabilityType(type)
            }))
        }
    })

router.get('/', async ctx => {
    ctx.body = {
        request_id: ctx.requestId,
        payload: {
            user_id: ctx.user.id,
            devices: await getUserDevices(ctx)
        }
    }
})

const retrieveState = (ctx, client, capability, instance, timeout = 2000) => new Promise(async (resovle, reject) => {
    setTimeout(() => reject('Timed out.'), timeout)
    ctx.ws.sendOp(client, 'get', {
        capability,
        instance
    })
        .then(value => {
            switch (capability) {
                case 'toggle':
                case 'on_off':
                    return value?.toString() === 'true' || value?.toString() === '1'
                case 'range':
                    return +value || 0
                case 'color_setting':
                    switch (instance) {
                        case 'rgb':
                            return +value || 0
                    }
                default:
                    return value
            }
        })
        .then(resovle)
        .catch(reject)
})

router.post('/query', koaBody(), async ctx => {
    const devices = await getUserDevices(ctx, ctx.request.body?.devices.map(({ id }) => id), true, true)
    for (const device of devices) {
        const client = ctx.ws.clients[device.id]
        if (!client) {
            continue
        }
        for (const capability of device.capabilities) {
            try {
                capability.state.value = await retrieveState(ctx, client, capability.type.replace('devices.capabilities.', ''), capability.state.instance)
            } catch (err) {
            }
        }
    }
    ctx.body = {
        request_id: ctx.requestId,
        payload: { devices }
    }
})

router.post('/action', koaBody(), async ctx => {
    const devices = ctx.request.body.payload.devices
        .reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {})
    const userDevices = (await ctx.repos.device.getByUserId(ctx.user.id, Object.keys(devices)))
    const payload = {
        devices: []
    }
    for (const userDevice of userDevices) {
        const capabilities = [];
        userDevice.capabilities.forEach(ensureState)
        const device = devices[userDevice.uid]
        if (!device) {
            return
        }
        for (const capability of device.capabilities) {
            const userDeviceCapability = userDevice.capabilities
                .filter(({ type }) => type === capability.type.split('.').slice(-1)[0])
                .find(udc => {
                    switch (udc.type) {
                        case 'color_setting':
                        case 'on_off':
                            return true;
                        case 'mode':
                        case 'range':
                        case 'toggle':
                            return udc.parameters.instance === capability.state.instance
                    }
                })
            if (!userDeviceCapability) {
                return
            }
            const client = ctx.ws.clients[userDevice.uid]
            if (client) {
                try {
                    await ctx.ws.sendOp(client, 'set', {
                        capability: userDeviceCapability.type,
                        instance: capability.state.instance || '',
                        value: capability.state.value + ''
                    })
                } catch (error) {
                    console.error(error)
                    throw { status: 500 }
                }
                userDeviceCapability.state = capability.state
                capabilities.push({
                    ...userDeviceCapability,
                    type: mapCapabilityType(userDeviceCapability.type),
                    state: {
                        ...userDeviceCapability.state,
                        action_result: {
                            status: "DONE"
                        }
                    }
                })
            } else {
                capabilities.push({
                    ...userDeviceCapability,
                    type: mapCapabilityType(userDeviceCapability.type),
                    state: {
                        ...userDeviceCapability.state,
                        action_result: {
                            status: "ERROR",
                            error_code: "DEVICE_UNREACHABLE"
                        }
                    }
                })
            }
        }
        ctx.repos.device.save(userDevice)
        const { _id, uid, ...uDevice } = userDevice
        payload.devices.push({
            ...uDevice,
            id: uid,
            type: mapDeviceType(uDevice.type),
            capabilities
        })
    }
    ctx.body = {
        request_id: ctx.requestId,
        payload
    }
})

module.exports = router