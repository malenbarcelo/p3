const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3')
const s3 = require('../src/data/r2Config')
const r2Credentials = require('../src/data/r2Credentials')

const DOWNLOAD_DIR = path.resolve(__dirname, '../public/videos')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Directorio en R2 (ej: p3/1): ', async (dir) => {
    rl.close()

    const prefix = dir.endsWith('/') ? dir : dir + '/'

    console.log(`\nBuscando archivos en "${prefix}"...\n`)

    // ensure download dir exists
    if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })

    let continuationToken
    let downloaded = 0
    let errors = 0

    do {
        const res = await s3.send(new ListObjectsV2Command({
            Bucket: r2Credentials.bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken
        }))

        const files = (res.Contents || []).filter(f => f.Size > 0)

        for (const file of files) {
            const fileName = path.basename(file.Key)
            const destPath = path.join(DOWNLOAD_DIR, fileName)

            if (fs.existsSync(destPath)) {
                console.log(`  ⏭ Ya existe: ${fileName}`)
                continue
            }

            console.log(`Descargando: ${file.Key}`)

            try {
                const obj = await s3.send(new GetObjectCommand({
                    Bucket: r2Credentials.bucket,
                    Key: file.Key
                }))

                const chunks = []
                for await (const chunk of obj.Body) {
                    chunks.push(chunk)
                }
                fs.writeFileSync(destPath, Buffer.concat(chunks))

                console.log(`  ✓ OK\n`)
                downloaded++
            } catch (err) {
                console.error(`  ✗ Error: ${err.message}\n`)
                errors++
            }
        }

        continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined

    } while (continuationToken)

    console.log(`\nListo! Descargados: ${downloaded} | Errores: ${errors}`)
})
