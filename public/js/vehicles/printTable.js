import g from "./globals.js"
import { f } from "./functions.js"
import { gf } from "../globalFunctions.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.vehicles

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-6-0 ts body-even' : 'body pad-6-0 ts body-odd'
        const detailsIcon = element.detected_events.length > 0 ? `<i class="fa-solid fa-magnifying-glass-plus pointer" id="details_${element.id}"></i>` : ''
        const trClass = element.detected_events.length == 0 ? '' : 'pointer'
        
        html += `
            <tr class="${trClass}" id="tr_${element.id}">
                <td class="${rowClass}">${element.vehicle_code}</td>
                <td class="${rowClass}">${element.detected_events.length == 0 ? '-' : element.detected_events[0].date}</td>
                <td class="${rowClass}">${element.detected_events.length == 0 ? '-' : element.detected_events[0].time}</td>
                <td class="${rowClass}">${detailsIcon}</td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)
}

function eventListeners(data) {

    data.forEach(element => {

        const details = document.getElementById('details_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        // details
        if (details) {
            details.addEventListener('click',async()=>{
                loader.style.display = 'block'
                g.firstLoad = 1
                g.firstLoad = 1
                g.edppFilters.id_vehicles = element.id
                //g.events = await f.getEventsData()
                //f.resetEventsData()
                edppTitle.innerText = element.vehicle_code
                edpp.style.display = 'block'
                requestAnimationFrame(() => edpp.classList.add('is-open'))
                edppUnfilter.click()
                loader.style.display = 'none'                
            })  
        }        

        // view details with double click
        tr.addEventListener('dblclick',async()=>{
            if (details) {
                details.click()
            }
        })
    })
}

export { printTable }