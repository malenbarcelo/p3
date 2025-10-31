import { domain } from "../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"
import { printEvents } from "./printEvents.js"

const f = {
    getData: async function() {

        console.log(domain)

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.vehicle_code == '' ? '' : `&vehicle_code=${g.filters.vehicle_code}`
        filters += g.filters.id_companies == '' ? '' : `&id_companies=${g.filters.id_companies}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${domain}get/vehicles?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    getEventsData: async function() {

        let filters = ''
        filters += g.edppFilters.page == '' ? '' : `&page=${g.edppFilters.page}`
        filters += g.edppFilters.size == '' ? '' : `&size=${g.edppFilters.size}`
        filters += g.edppFilters.order == '' ? '' : `&order=${g.edppFilters.order}`
        filters += g.edppFilters.id_vehicles == '' ? '' : `&id_vehicles=${g.edppFilters.id_vehicles}`
        filters += g.edppFilters.date_from == '' ? '' : `&date_from=${g.edppFilters.date_from}`
        filters += g.edppFilters.date_until == '' ? '' : `&date_until=${g.edppFilters.date_until}`
        filters += g.edppFilters.duration_min == '' ? '' : `&duration_min=${g.edppFilters.duration_min}`
        filters += g.edppFilters.duration_max == '' ? '' : `&duration_max=${g.edppFilters.duration_max}`

        const fetchData = await (await fetch(`${domain}get/detected-events?${filters}`)).json()

        g.edppPages = fetchData.pages
        
        return fetchData.rows
    },

    resetData: async function() {
        
        //update scroll data
        g.filters.page = 1
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        //get and print data
        g.vehicles = await this.getData()
        printTable()

        // unscroll
        table.scrollTop = 0
    },

    resetEventsData: async function() {
        
        //update scroll data
        g.edppFilters.page = 1
        g.edppLoadedPages = new Set()
        g.edppPreviousScrollTop = 0

        //get and print data
        g.events = await this.getEventsData()
        printEvents()

        // unscroll
        edppTable.scrollTop = 0
    },

    
}

export { f }