import g from "./globals.js"
import { printEvents } from "./printEvents.js"
import { f } from "./functions.js"
import { gf } from "../globalFunctions.js"

// events details popup (EDPP)
async function edppEventListeners() {

    // add data with scroll
    edppTable.addEventListener('scroll', async () => {
        if (edppTable.scrollTop > g.edppPreviousScrollTop) {  // down scroll
            if (edppTable.scrollTop + edppTable.clientHeight + 1 >= edppTable.scrollHeight) {
                edppLoader.style.display = 'block'                
                if (!g.edppLoadedPages.has(g.edppFilters.page + 1) && g.edppFilters.page < g.edppPages){
                    g.edppFilters.page += 1
                    g.edppLoadedPages.add(g.edppFilters.page)
                    const newData = await f.getEventsData()                    
                    g.events = [...g.events, ...newData]
                    printEvents()
                }
                edppLoader.style.display = 'none'                
            }
            edppLoader.style.display = 'none'
        }
        // Update previous position
        g.edppPreviousScrollTop = edppTable.scrollTop
        edppLoader.style.display = 'none'
    })

    // filters event listeners
    const filters = [dateFrom, dateUntil, durationMin, durationMax]

    for (const filter of filters) {

        filter.addEventListener("change", async () => {
            
            // show loader
            edppLoader.style.display = 'block'

            //complete filters
            g.edppFilters.date_from = dateFrom.value == '' ? '' : Math.floor(new Date(dateFrom.value + 'T00:00:00').getTime() / 1000) // to timestamp
            g.edppFilters.date_until = dateUntil.value == '' ? '' : Math.floor(new Date(dateUntil.value + 'T00:00:00').getTime() / 1000) // to timestamp
            g.edppFilters.duration_min = durationMin.value
            g.edppFilters.duration_max = durationMax.value

            await f.resetEventsData()

            // hide loader
            edppLoader.style.display = 'none'
        })
    }

    // unfilter event listener
    edppUnfilter.addEventListener("click", async() => {        
        
        // reset filters
        gf.clearInputs(filters)
        g.edppFilters.date_from = ''
        g.edppFilters.date_until = ''
        g.edppFilters.duration_min = ''
        g.edppFilters.duration_max = ''

        await f.resetEventsData()
        
    })
    
}


export {edppEventListeners}