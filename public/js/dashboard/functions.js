import { domain } from "../domain.js"
import g from "./globals.js"

const f = {

    getWeeksEvents: async function() {

        let filters = ''

        filters += `&grater_than=${g.graterThan}`
        filters += `&less_than=${g.lessThan}`
        const fetchData = await (await fetch(`${domain}composed/weeks-events?${filters}`)).json()
        
        return fetchData
    },

    getDaysEvents: async function() {

        let filters = ''
        const fetchData = await (await fetch(`${domain}composed/days-events?${filters}`)).json()
        
        return fetchData
    },

    getMonthsEvents: async function() {

        let filters = ''
        filters += `&grater_than=${g.graterThan}`
        filters += `&less_than=${g.lessThan}`
        filters += `&months_to_get=${g.monthsToGet}`
        const fetchData = await (await fetch(`${domain}composed/months-events?${filters}`)).json()
        
        return fetchData
    },
    
}

export { f }