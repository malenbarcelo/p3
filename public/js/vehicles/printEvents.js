import g from "./globals.js"
import { f } from "./functions.js"

async function printEvents() {

    edppLoader.style.display = 'block'

    edppBody.innerHTML = ''
    let html = ''
    const data = g.events

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-6-0 ts body-even' : 'body pad-6-0 ts body-odd'
        
        // timestamp 90 previous days
        const lastTimestamp = Math.floor(Date.now() / 1000) - 95 * 24 * 60 * 60
        
        // view and download icons
        const enabledIcon = element.start_timestamp > lastTimestamp && element.findVideo == 1
        const viewIcon = enabledIcon ? `<i class="fa-regular fa-eye pointer" id="edppView_${element.id}"></i>` : `<i class="fa-solid fa-video-slash unabled-icon"></i>`
        const downloadIcon = enabledIcon ? `<a href="/videos/${element.video}.mp4" download="${element.video}.mp4"><i class="fa-solid fa-download pointer" id="edppDownload_${element.id}"></i></a>` : `<i class="fa-solid fa-video-slash unabled-icon"></i>`
        
        html += `
            <tr class="">
                <td class="${rowClass}">${element.date}</td>
                <td class="${rowClass}">${element.time}</td>
                <td class="${rowClass}">${element.duration_seconds}</td>
                <td class="${rowClass}">${viewIcon}</td>
                <td class="${rowClass}">${downloadIcon}</td>
            </tr>
            `
    })

    edppBody.innerHTML = html

    eventListeners(data)

    edppLoader.style.display = 'none'
}

function eventListeners(data) {

    data.forEach(element => {

        const view = document.getElementById('edppView_' + element.id)
        const download = document.getElementById('edppDownload_' + element.id)

        // view
        if (view) {
            view.addEventListener('click',async()=>{

                edppLoader.style.display = 'block'

                const videoUrl = `videos/${element.video}.mp4`
                
                vvppTitle.innerText = element.vehicle_data.vehicle_code
                vvppSubtitle.innerText = element.date + ' ' + element.time

                vvpp.style.display = 'block'

                try {
                    const head = await fetch(videoUrl, { method: 'HEAD', cache: 'no-store' })
                    if (!head.ok) throw new Error(`HTTP ${head.status}`)
                    vvppVideoName.src = videoUrl
                    vvppVideoPlayer.load()
                    vvppVideoPlayer.play().catch(e => console.log('Play error:', e))
                } catch (err) {
                    console.error('No se pudo cargar el video:', err)
                } finally {
                    edppLoader.style.display = 'none'
                }            
            })
        }
    })
}

export { printEvents }