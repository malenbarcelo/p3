const { S3Client } = require('@aws-sdk/client-s3')
const r2Credentials = require('./r2Credentials')

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${r2Credentials.accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: r2Credentials.accessKey,
        secretAccessKey: r2Credentials.secretKey
    }
})

module.exports = s3