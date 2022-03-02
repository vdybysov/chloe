const useMPromise = (supplier) => {
    let resolvers = []
    return {
        get: () => new Promise(async (resolve, reject) => {
            resolvers.push({
                resolve,
                reject
            })
            if (resolvers.length !== 1) {
                return
            }
            try {
                const result = await supplier()
                resolvers.forEach(({ resolve }) => resolve(result))
            } catch (error) {
                resolvers.forEach(({ reject }) => reject(error))
            } finally {
                resolvers = []
            }
        })
    }
}

export default useMPromise