import { dominio } from "./dominio.js"
import { printTable, printCards, getDateByFromTimestamp } from "./functions/vehiclesFunctions.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    //data
    const vehiclesData = await (await fetch(dominio + 'apis/vehicles-data')).json()
    const detectedEvents = await (await fetch(dominio + 'apis/detected-events-data')).json()

    //elements
    const filterVehicle = document.getElementById('filterVehicle')
    const unfilter = document.getElementById('unfilter')
    const orderDateAsc = document.getElementById('orderDateAsc')
    const orderDateDesc = document.getElementById('orderDateDesc')
    const closePopup = document.getElementById('closePopup')
    let filteredData = []
    let filtersQty = 0

    //events popup
    const closeSidePopup = document.getElementById('closeSidePopup')
    const filterDate = document.getElementById('filterDate')
    const unfilterDate = document.getElementById('unfilterDate')

    //print vehicles data
    printTable(vehiclesData,detectedEvents)

    //////////////////////////////FILTERS EVENT LISTENERS//////////////////////////////
    filterVehicle.addEventListener('change',async()=>{

        const vehicle = filterVehicle.value
        filtersQty += 1

        //get filtered data
        if (vehicle == '') {
            filteredData = vehiclesData
        }else{
            filteredData = vehiclesData.filter(element => element.vehicle_code == vehicle)
        }

        printTable(filteredData,detectedEvents)

    })

    filterDate.addEventListener('change',async()=>{

        const showAllSteps = document.getElementById('showAllSteps')
        showAllSteps.checked = false

        eventsCards.innerHTML = ''

        const vehicleCode = document.getElementById('vehicleCode').innerText
        
        //get vehicle events
        let vehicleEvents = detectedEvents.filter(event => event.vehicle_code == vehicleCode)
        
        vehicleEvents.forEach(event => {
            const date = new Date(event.start_date_time * 1000)
            const fulldate = getDateByFromTimestamp(date)
            let eventDate = fulldate.split(" ")[0].split("-")
            const eventDateDay = eventDate[0]
            const eventDateMonth = eventDate[1]
            const eventDateYear = eventDate[2]
            
            event.event_date = eventDateYear + '-' + eventDateMonth + '-' + eventDateDay
        })

        const vehicleEventsFiltered = vehicleEvents.filter(event => event.event_date == filterDate.value)

        

        //print cards
        await printCards(vehicleEventsFiltered)

    })

    //////////////////////////////DELETE FILTERS EVENT LISTENERS//////////////////////////////
    unfilter.addEventListener('click',async()=>{
        filtersQty = 0
        filterVehicle.value = ''
        printTable(vehiclesData,detectedEvents)
    })

    unfilterDate.addEventListener('click',async()=>{
        const showAllSteps = document.getElementById('showAllSteps')
        showAllSteps.checked = false

        eventsCards.innerHTML = ''        
        const vehicleCode = document.getElementById('vehicleCode').innerText        
        //get vehicle events
        const vehicleEvents = detectedEvents.filter(event => event.vehicle_code == vehicleCode)
        //print cards
        await printCards(vehicleEvents)
        filterDate.value = ''
        
    })

    //////////////////////////////ORDER DATES//////////////////////////////
    orderDateAsc.addEventListener('click',async()=>{

        let orderedData = filtersQty == 0 ? vehiclesData : filteredData
       
        orderedData.forEach(element => {
            if (element.detectedEvents.length == 0) {
                element.last_detected_event_id = 10000000000
            }else{                
                element.last_detected_event_id =  element.detectedEvents.reduce((max, current) => max.id > current.id ? max : current).id                
            }
        })

        orderedData.sort((a, b) => a.last_detected_event_id - b.last_detected_event_id)

        printTable(orderedData,detectedEvents)

        orderDateAsc.classList.add('notVisible')
        orderDateDesc.classList.remove('notVisible')

    })

    orderDateDesc.addEventListener('click',async()=>{

        let orderedData = filtersQty == 0 ? vehiclesData : filteredData
       
        orderedData.forEach(element => {
            if (element.detectedEvents.length == 0) {
                element.last_detected_event_id = -10000000000
            }else{                
                element.last_detected_event_id =  element.detectedEvents.reduce((max, current) => max.id > current.id ? max : current).id                
            }
        })

        orderedData.sort((a, b) => b.last_detected_event_id - a.last_detected_event_id)

        printTable(orderedData,detectedEvents)

        orderDateAsc.classList.remove('notVisible')
        orderDateDesc.classList.add('notVisible')
    })

    //////////////////////////////CLOSE POPUPS//////////////////////////////
    closePopup.addEventListener('click',async()=>{
        const locationInfo = document.getElementById('locationInfo')
        locationInfo.style.display = 'none'
    })

    closeSidePopup.addEventListener('click',async()=>{
        const eventsPopup = document.getElementById('eventsPopup')
        eventsPopup.classList.remove('slideIn')
    })

    loader.style.display = 'none'

})