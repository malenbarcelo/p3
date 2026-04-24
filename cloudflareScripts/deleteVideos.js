const fs = require('fs')
const path = require('path')

const VIDEOS_DIR = path.resolve(__dirname, '../public/videos')

const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'))

console.log(`Encontrados ${files.length} videos\n`)

let deleted = 0
let errors = 0

for (const file of files) {
    try {
        fs.unlinkSync(path.join(VIDEOS_DIR, file))
        console.log(`  ✓ Eliminado: ${file}`)
        deleted++
    } catch (err) {
        console.error(`  ✗ Error: ${file} - ${err.message}`)
        errors++
    }
}

console.log(`\nListo! Eliminados: ${deleted} | Errores: ${errors}`)
