function getHost (req) {
    const host = req.get('host')
    return host
}

module.exports = getHost