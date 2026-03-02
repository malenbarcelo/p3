import g from "./globals.js"

// Crear tooltip flotante
const tooltip = document.createElement('div');
tooltip.className = 'custom-tooltip';
document.body.appendChild(tooltip);

function showTooltip(element, text) {
    const rect = element.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    tooltip.classList.remove('show');
}

async function printEvents() {

    if (g.firstLoad == 0) {        
        edppLoader.style.display = 'block'
    }

    edppBody.innerHTML = ''
    let html = ''
    const data = g.events

    data.forEach((element,index) => {
        
        // timestamp 90 previous days
        const lastTimestamp = Math.floor(Date.now() / 1000) - 500 * 24 * 60 * 60
        
        // view and download icons
        const enabledIcon = element.start_timestamp > lastTimestamp && element.findVideo == 1
        const viewIcon = enabledIcon ? `<i class="fa-regular fa-circle-play event-action-icon" id="edppView_${element.id}" data-tooltip="Reproducir video"></i>` : `<i class="fa-solid fa-circle-play unabled-icon"></i>`
        const downloadIcon = enabledIcon ? `<a href="/videos/${element.video}.mp4" download="${element.video}.mp4"><i class="fa-solid fa-download event-action-icon" id="edppDownload_${element.id}" data-tooltip="Descargar video"></i></a>` : `<i class="fa-solid fa-download unabled-icon"></i>`
        
        html += `
            <div class="event-list-item">
                <div class="list-item-col" style="flex: 1.5;">${element.date}</div>
                <div class="list-item-col" style="flex: 1.5;">${element.time}</div>
                <div class="list-item-col" style="flex: 1.5;">${element.duration_seconds}</div>
                <div class="list-item-col" style="width: 80px; display: flex; justify-content: center;">${viewIcon}</div>
                <div class="list-item-col" style="width: 80px; display: flex; justify-content: center;">${downloadIcon}</div>
            </div>
            `
    })

    edppBody.innerHTML = html

    eventListeners(data)

    g.firstLoad = 0

    edppLoader.style.display = 'none'
}

function eventListeners(data) {

    data.forEach(element => {

        const view = document.getElementById('edppView_' + element.id)
        const download = document.getElementById('edppDownload_' + element.id)

        // view
        if (view) {
            // Tooltip
            view.addEventListener('mouseenter', () => showTooltip(view, 'Reproducir video'));
            view.addEventListener('mouseleave', hideTooltip);
            
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
        
        // download
        if (download) {
            // Tooltip
            download.addEventListener('mouseenter', () => showTooltip(download, 'Descargar video'));
            download.addEventListener('mouseleave', hideTooltip);
        }
    })
}

export { printEvents }