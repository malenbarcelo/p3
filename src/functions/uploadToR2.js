const { PutObjectCommand } = require('@aws-sdk/client-s3')
const s3 = require('../data/r2Config')
const r2Credentials = require('../data/r2Credentials')

const uploadToR2 = async ({ fileBuffer, fileName,idCompanies }) => {

    const key = `p3/${idCompanies}/${fileName}`

    const command = new PutObjectCommand({
        Bucket: r2Credentials.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: 'video/mp4'
    })

    await s3.send(command)

    return `${r2Credentials.publicUrl}/${key}`
}

module.exports = uploadToR2