import g from "./globals.js"
import { printTable } from "./printTable.js"
import { f } from "./functions.js"
import { gf } from "../globalFunctions.js"

// popups event listeners
import { edppEventListeners} from "./vehiclesEDPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'
    
    // findout if there is company filter
    const company = document.getElementById('company')

    // get data
    g.vehicles = await f.getData()
    
    // print table
    printTable()

    // add data with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await f.getData()                    
                    g.vehicles = [...g.vehicles, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    // popups event listeners
    edppEventListeners()
    
    // close popups
    gf.closePopups(g.popups,g.sidePopups)
    
    // close with escape
    gf.closeWithEscape(g.popups, g.sidePopups)
    
    // al terminar la transición, oculto totalmente
    g.sidePopups.forEach(popup => {
        popup.addEventListener('transitionend', e => {
            if (e.propertyName === 'transform' && !popup.classList.contains('is-open')){
                popup.style.display = 'none'
            }
        })
    })

    // show tooltips
    gf.showTooltips(g.tooltips,245,100)
    gf.showTooltips(g.edppTooltips,207,100)

    // filters event listeners
    const filters = [vehicle,company].filter( f => f != null)

    for (const filter of filters) {

        filter.addEventListener("change", async () => {
            
            // show loader
            loader.style.display = 'block'

            //complete filters
            g.filters.vehicle_code = vehicle.value
            g.filters.id_companies = company == null ? '' : company.value

            await f.resetData()

            // hide loader
            loader.style.display = 'none'
        })
    }

    // unfilter event listener
    unfilter.addEventListener("click", async() => {        
        
        // show loader
        loader.style.display = 'block'
        
        // reset filters
        gf.clearInputs(filters)
        g.filters.vehicle_code = ''
        g.filters.id_companies = ''

        await f.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })
    
    loader.style.display = 'none'

})