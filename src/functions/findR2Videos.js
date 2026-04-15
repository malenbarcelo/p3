const fetch = require('node-fetch')

const findR2Videos = async (url) => {
    try {

        const response = await fetch(url, { method: 'HEAD' })

        return response.ok

    } catch (error) {
        return false
    }
}

module.exports = findR2Videos