const fs = require('fs')
const path = require('path')
const { PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const s3 = require('../src/data/r2Config')
const r2Credentials = require('../src/data/r2Credentials')

const VIDEOS_DIR = path.resolve('./public/videos')
const VMOS_DEVICES = ['SDA00008', 'SDA00014', 'SDA00019', 'SDA00055']

function getDestFolder(fileName) {
    const upper = fileName.toUpperCase()

    if (upper.includes('AESA')) return 'p3/3'
    if (upper.includes('VMOS')) return 'p3/2'
    if (VMOS_DEVICES.some(d => upper.includes(d))) return 'p3/2'
    if (upper.includes('CONTRERAS')) return 'p3/5'
    return 'p3/1'
}

async function existsInR2(key) {
    try {
        await s3.send(new HeadObjectCommand({ Bucket: r2Credentials.bucket, Key: key }))
        return true
    } catch {
        return false
    }
}

async function main() {
    const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'))

    console.log(`Encontrados ${files.length} videos\n`)

    let skipped = 0
    let uploaded = 0
    let errors = 0

    for (const file of files) {
        const folder = getDestFolder(file)
        const key = `${folder}/${file}`

        if (await existsInR2(key)) {
            console.log(`  ⏭ Ya existe: ${key}`)
            skipped++
            continue
        }

        const filePath = path.join(VIDEOS_DIR, file)
        const fileBuffer = fs.readFileSync(filePath)

        console.log(`Subiendo: ${file} → ${key}`)

        try {
            await s3.send(new PutObjectCommand({
                Bucket: r2Credentials.bucket,
                Key: key,
                Body: fileBuffer,
                ContentType: 'video/mp4'
            }))
            console.log(`  ✓ OK\n`)
            uploaded++
        } catch (err) {
            console.error(`  ✗ Error: ${err.message}\n`)
            errors++
        }
    }

    console.log(`\nListo! Subidos: ${uploaded} | Existentes: ${skipped} | Errores: ${errors}`)
}

main()
