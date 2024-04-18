import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

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

    //events data popups
    const closeEventVideo = document.getElementById('closeEventVideo')
    const closeEventLocation = document.getElementById('closeEventLocation')

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

    //////////////////////////////DELETE FILTERS EVENT LISTENERS//////////////////////////////
    unfilter.addEventListener('click',async()=>{
        filtersQty = 0
        filterVehicle.value = ''
        printTable(vehiclesData,detectedEvents)
    })

    //////////////////////////////ORDER DATES//////////////////////////////
    orderDateAsc.addEventListener('click',async()=>{

        let orderedData = filtersQty == 0 ? vehiclesData : filteredData

        orderedData.sort((a, b) => b.last_actualization - a.last_actualization)

        printTable(orderedData,detectedEvents)

        orderDateAsc.classList.add('notVisible')
        orderDateDesc.classList.remove('notVisible')

    })

    orderDateDesc.addEventListener('click',async()=>{

        let orderedData = filtersQty == 0 ? vehiclesData : filteredData

        orderedData.sort((a, b) => a.last_actualization - b.last_actualization)

        printTable(orderedData,detectedEvents)

        orderDateAsc.classList.remove('notVisible')
        orderDateDesc.classList.add('notVisible')
    })

    //////////////////////////////SHOW LOCATIONS//////////////////////////////
    orderDateDesc.addEventListener('click',async()=>{

        let orderedData = filtersQty == 0 ? vehiclesData : filteredData

        orderedData.sort((a, b) => a.last_actualization - b.last_actualization)

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

    closeEventVideo.addEventListener('click',async()=>{
        const eventVideo = document.getElementById('eventVideo')
        eventVideo.style.display = 'none'
    })

    closeEventLocation.addEventListener('click',async()=>{
        const eventLocation = document.getElementById('eventLocation')
        eventLocation.style.display = 'none'
    })

})

//////////////////////////////FUNCTIONS//////////////////////////////
function printTable(dataToPrint,detectedEvents) {

    const body = document.getElementById('vehiclesBody')
    body.innerHTML = ''

    let counter = 0

    //printTable
    dataToPrint.forEach(element => {
        
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        //get last event detected full date
        let lastEventFullDate = 'Sin eventos detectados'
        
        if (element.detectedEvents.length != 0) {
            const lastDetectedEventDate = element.detectedEvents.reduce((max, current) => (current.id > max.id ? current : max))
            const date = new Date(lastDetectedEventDate.start_date_time * 1000)
            lastEventFullDate = getDateByFromTimestamp(date)            
        }

        //get last location full date
        const date = new Date(element.last_actualization * 1000)
        const fullDate = getDateByFromTimestamp(date) 

        //add magnifying glass only if there are detected events
        let magnifyingGlass = ''
        if (element.detectedEvents.length != 0) {
            magnifyingGlass = '<i class="fa-solid fa-magnifying-glass-plus bodyIcon" id="events_' + element.id + '">'            
        }

        //print table
        const line1 = '<th class="' + rowClass + '">' + element.vehicle_code + '</th>'  
        const line3 = '<th class="' + rowClass + '">' + fullDate + '</th>'
        const line4 = '<th class="' + rowClass + '">' + lastEventFullDate + '</th>'
        const line5 = '<th class="' + rowClass + '"><i class="fa-solid fa-map-location-dot bodyIcon" id="location_' + element.id + '"></th>'
        const line6 = '<th class="' + rowClass + '">' + magnifyingGlass + '</th>'

        body.innerHTML += '<tr>' + line1 + line3 + line4 + line5 + line6 + '</tr>'

        counter += 1

    })

    //add event listeners
    const locationInfo = document.getElementById('locationInfo')
    const gmpMap = document.getElementById('gmpMap')
    const gmpMapMarker = document.getElementById('gmpMapMarker')
    const vehicleName = document.getElementById('vehicleName')
    const vehicleLatLong = document.getElementById('vehicleLatLong')

    dataToPrint.forEach(element => {

        const location = document.getElementById('location_' + element.id)
        const events = document.getElementById('events_' + element.id)
        const eventsPopup = document.getElementById('eventsPopup')
        
        //location info
        location.addEventListener('click',async()=>{
            const locationPosition = location.getBoundingClientRect()
            const latitude = parseFloat(element.last_location_latitude,20)
            const longitude = parseFloat(element.last_location_longitude,20)
            const centerCoordinates = { lat: latitude, lng: longitude };
            gmpMap.center = centerCoordinates;
            gmpMapMarker.position = centerCoordinates;

            locationInfo.style.left = `${locationPosition.left - 390}px`;
            locationInfo.style.top = `${locationPosition.top}px`;

            vehicleName.innerText = 'Vehículo ' + element.vehicle_code
            vehicleLatLong.innerText = 'Lat,Long: ' + element.last_location_latitude + ',' + element.last_location_longitude
            
            locationInfo.style.display = 'block'

        })

        //events info
        if (events != null) {
            events.addEventListener('click',async()=>{

                const vehicleTitle = document.getElementById('vehicleTitle')
                const eventsCards = document.getElementById('eventsCards')
                eventsCards.innerHTML = ''

                //popup title
                vehicleTitle.innerText = 'Vehiculo ' + element.vehicle_code

                //get vehicle events
                const vehicleEvents = detectedEvents.filter(event => event.vehicle_code == element.vehicle_code)

                //print cards
                vehicleEvents.forEach(event => {
                    
                    //get event date
                    const date = new Date(event.start_date_time * 1000)
                    const eventDate = getDateByFromTimestamp(date)

                    const line1 = '<div class="eventCard">'
                    const line2 = '<div class="cardData"><b>EVENTO: </b>' + event.event + '</div>'
                    const line3 = '<div class="cardData"><b>FECHA: </b>' + eventDate + '</div>'
                    const line6 = '<div class="cardIcons">'
                    const line7 = '<div><i class="fa-solid fa-location-dot cardIcon" id="cardIconLocation_' + event.id +'"></i></div>'
                    const line8 = '<div><i class="fa-regular fa-eye cardIcon" id="cardIconEye_' + event.id +'"></i></div>'
                    const line9 = '<div><a href="/events/download-video/' + event.video + '"><i class="fa-solid fa-download cardIcon" id="cardIconDownload_' + event.id +'"></i></a></div>'
                    const line10 = '</div></div>'

                    const cardHTML = line1 + line2 + line3 + line6 + line7 + line8 + line9 + line10
                    eventsCards.innerHTML += cardHTML
                    
                })

                //add event listeners
                vehicleEvents.forEach(event => {
                    const cardIconLocation = document.getElementById('cardIconLocation_' + event.id)
                    const cardIconEye = document.getElementById('cardIconEye_' + event.id)
                    const cardIconDownload = document.getElementById('cardIconDownload_' + event.id)
                    const eventVideo = document.getElementById('eventVideo')
                    const eventLocation = document.getElementById('eventLocation')                   

                    cardIconEye.addEventListener('click',async()=>{
                        const divVideo = document.getElementById('divVideo')                        
                        const vehicleCode = document.getElementById('vehicleCode')                        
                        const eventDate = document.getElementById('eventDate')
                        const locationPosition = cardIconEye.getBoundingClientRect()
                        eventVideo.style.left = `${locationPosition.left - 430}px`
                        eventVideo.style.top = `${locationPosition.top}px`

                        const date = new Date(event.start_date_time * 1000)
                        const videoDate = getDateByFromTimestamp(date)
                        
                        vehicleCode.innerText = event.event + ' - Vehículo ' + event.vehicle_code
                        eventDate.innerText = 'Fecha: ' + videoDate

                        //add video to div
                        const line1 = '<video class="video" id="videoPlayer" controls>'
                        const line2 = '<source src="/videos/' + event.video + '.mp4" type="video/mp4" id="videoName"></source>'
                        const line3 = '</video>'
                        divVideo.innerHTML = line1 + line2 + line3

                        const videoPlayer = document.getElementById('videoPlayer')
                        
                        eventVideo.style.display = 'block'

                        videoPlayer.play()
                    })

                    cardIconEye.addEventListener('mouseover',async()=>{
                        const viewVideoInfo = document.getElementById('viewVideoInfo')
                        const locationPosition = cardIconEye.getBoundingClientRect()
                        viewVideoInfo.style.left = `${locationPosition.left - 20}px`
                        viewVideoInfo.style.top = `${locationPosition.top + 20}px`
                        viewVideoInfo.style.display = 'block'
                    })

                    cardIconEye.addEventListener('mouseout',async()=>{
                        const viewVideoInfo = document.getElementById('viewVideoInfo')                        
                        viewVideoInfo.style.display = 'none'
                    })

                    cardIconLocation.addEventListener('click',async()=>{
                        const eventVehicleCode = document.getElementById('eventVehicleCode')                        
                        const eventLatLong = document.getElementById('eventLatLong')
                        const locationPosition = cardIconEye.getBoundingClientRect()
                        eventLocation.style.left = `${locationPosition.left - 400}px`
                        eventLocation.style.top = `${locationPosition.top}px`

                        eventVehicleCode.innerText = 'Vehículo ' + event.vehicle_code
                        eventLatLong.innerText = 'Lat,Long: ' + event.start_location_latitude + ',' + event.start_location_longitude

                        //add map to div
                        const gmpMap2 = document.getElementById('gmpMap2')
                        const gmpMapMarker2 = document.getElementById('gmpMapMarker2')
                        const latitude = parseFloat(event.start_location_latitude,20)
                        const longitude = parseFloat(event.start_location_longitude,20)
                        const centerCoordinates = { lat: latitude, lng: longitude }                        
                        gmpMap2.center = centerCoordinates
                        gmpMapMarker2.position = centerCoordinates

                        eventLocation.style.display = 'block'
                    })

                    cardIconLocation.addEventListener('mouseover',async()=>{
                        const viewMapInfo = document.getElementById('viewMapInfo')
                        const locationPosition = cardIconEye.getBoundingClientRect()
                        viewMapInfo.style.left = `${locationPosition.left - 50}px`
                        viewMapInfo.style.top = `${locationPosition.top + 20}px`
                        viewMapInfo.style.display = 'block'
                    })

                    cardIconLocation.addEventListener('mouseout',async()=>{
                        const viewMapInfo = document.getElementById('viewMapInfo')                        
                        viewMapInfo.style.display = 'none'
                    })

                    cardIconDownload.addEventListener('mouseover',async()=>{
                        const downloadVideoInfo = document.getElementById('downloadVideoInfo')
                        const locationPosition = cardIconEye.getBoundingClientRect()
                        downloadVideoInfo.style.left = `${locationPosition.left - 8}px`
                        downloadVideoInfo.style.top = `${locationPosition.top + 20}px`
                        downloadVideoInfo.style.display = 'block'
                    })

                    cardIconDownload.addEventListener('mouseout',async()=>{
                        const downloadVideoInfo = document.getElementById('downloadVideoInfo')                        
                        downloadVideoInfo.style.display = 'none'
                    })
                    


                })
                
                //show popup
                eventsPopup.classList.add('slideIn')
            })
            
        }
        
    })
}

function getDateByFromTimestamp(date) {

    //date
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    day = day < 10 ? "0" + day : day
    month = (month+1) < 10 ? "0" + (month+1) : (month+1)

    //time
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    hours = hours < 10 ? "0" + hours : hours
    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds
    
    const fullDate = day + "-" + month + "-" + year +' ' + hours + ":" + minutes + ":" + seconds

    return fullDate
}

