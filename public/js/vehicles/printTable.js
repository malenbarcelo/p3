import g from "./globals.js"
import { f } from "./functions.js"
import { gf } from "../globalFunctions.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.vehicles

    data.forEach((element,index) => {

        const hasEvents = element.detected_events.length > 0
        const itemClass = hasEvents ? 'vehicle-list-item' : 'vehicle-list-item no-events'
        const detailsIcon = hasEvents ? `<i class="fa-solid fa-chevron-right list-action-icon" id="details_${element.id}"></i>` : ''
        
        if (hasEvents) {
            const date = element.detected_events[0].date
            const time = element.detected_events[0].time
            
            html += `
                <div class="${itemClass}" id="tr_${element.id}">
                    <div class="list-item-col vehicle-name">${element.vehicle_code}</div>
                    <div class="list-item-col date">${date}</div>
                    <div class="list-item-col time">${time}</div>
                    <div class="list-item-col actions">${detailsIcon}</div>
                </div>
            `
        } else {
            html += `
                <div class="${itemClass}" id="tr_${element.id}">
                    <div class="list-item-col vehicle-name">${element.vehicle_code}</div>
                    <div class="list-item-col no-events-message" style="flex: 1.5;">Sin eventos detectados</div>
                    <div class="list-item-col empty" style="flex: 1.5;">-</div>
                    <div class="list-item-col actions"></div>
                </div>
            `
        }
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
                g.edppFilters.id_vehicles = element.id

                // reset filters
                g.edppFilters.date_from = ''
                g.edppFilters.date_until = ''
                g.edppFilters.duration_min = ''
                g.edppFilters.duration_max = ''
                gf.clearInputs([dateFrom, dateUntil, durationMin, durationMax])

                // wait for data
                await f.resetEventsData()

                // open popup with data already loaded
                edppTitle.innerText = element.vehicle_code
                edpp.style.display = 'block'
                requestAnimationFrame(() => edpp.classList.add('is-open'))

                loader.style.display = 'none'                
            })  
        }        

        // view details with double click
        tr.addEventListener('click',async()=>{
            if (details) {
                details.click()
            }
        })
    })
}

export { printTable }