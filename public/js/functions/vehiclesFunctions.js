import { dominio } from "../dominio.js"

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
        //const line5 = '<th class="' + rowClass + '"><i class="fa-solid fa-map-location-dot bodyIcon" id="location_' + element.id + '"></th>'
        const line6 = '<th class="' + rowClass + '">' + magnifyingGlass + '</th>'

        body.innerHTML += '<tr>' + line1 + line3 + line4 + /*line5 + */line6 + '</tr>'

        counter += 1

    })

    //add event listeners
    //const locationInfo = document.getElementById('locationInfo')
    const gmpMap = document.getElementById('gmpMap')
    const gmpMapMarker = document.getElementById('gmpMapMarker')
    const vehicleName = document.getElementById('vehicleName')
    const vehicleLatLong = document.getElementById('vehicleLatLong')

    dataToPrint.forEach(element => {

        //const location = document.getElementById('location_' + element.id)
        const events = document.getElementById('events_' + element.id)
        const eventsPopup = document.getElementById('eventsPopup')

        //location info
        // location.addEventListener('click',async()=>{
        //     const divTable = document.getElementById('divTable')
            
        //     const locationPosition = location.getBoundingClientRect()
        //     const latitude = parseFloat(element.last_location_latitude,20)
        //     const longitude = parseFloat(element.last_location_longitude,20)
        //     const centerCoordinates = { lat: latitude, lng: longitude };
        //     gmpMap.center = centerCoordinates;
        //     gmpMapMarker.position = centerCoordinates;

        //     locationInfo.style.left = `${locationPosition.left - 390}px`;
        //     locationInfo.style.top = `${locationPosition.top}px`;

        //     vehicleName.innerText = 'Vehículo ' + element.vehicle_code
        //     vehicleLatLong.innerText = 'Lat,Long: ' + element.last_location_latitude + ',' + element.last_location_longitude

        //     eventsPopup.classList.remove('slideIn')
        //     locationInfo.style.display = 'block'

        // })

        //events info
        if (events != null) {
            events.addEventListener('click',async()=>{

                loader.style.display = 'block'

                const vehicleTitle = document.getElementById('vehicleTitle')
                const eventsCards = document.getElementById('eventsCards')
                const vehicleCode = document.getElementById('vehicleCode')
                const showAllSteps = document.getElementById('showAllSteps')
                
                eventsCards.innerHTML = ''

                //unckeck show steps
                showAllSteps.checked = false
                
                //popup title
                vehicleTitle.innerText = 'Vehículo ' + element.vehicle_code

                //get vehicle events
                const vehicleEvents = detectedEvents.filter(event => event.vehicle_code == element.vehicle_code)

                //print cards
                await printCards(vehicleEvents)

                //show and hide popup
                vehicleCode.innerText = element.vehicle_code
                locationInfo.style.display = 'none'
                eventsPopup.classList.add('slideIn')

                loader.style.display = 'none'
            })
        }
    })
}

async function printCards(cardsToPrint) {

    const videos = await (await fetch(dominio + 'apis/all-videos')).json()
    const showAllSteps = document.getElementById('showAllSteps')

    showAllSteps.addEventListener('click',async()=>{
        if (showAllSteps.checked) {
            for (let i = 0; i < cardsToPrint.length; i++) {
                const cardSteps = document.getElementById('cardSteps_' + cardsToPrint[i].id)
                const hideDetails = document.getElementById('hideDetails_' + cardsToPrint[i].id)
                const showDetails = document.getElementById('showDetails_' + cardsToPrint[i].id)
                
                if (cardSteps != null) {
                    cardSteps.classList.remove('notVisible')
                    hideDetails.style.display = 'block'
                    showDetails.style.display = 'none'
                }
            }
        }else{
            for (let i = 0; i < cardsToPrint.length; i++) {
                const cardSteps = document.getElementById('cardSteps_' + cardsToPrint[i].id)
                const hideDetails = document.getElementById('hideDetails_' + cardsToPrint[i].id)
                const showDetails = document.getElementById('showDetails_' + cardsToPrint[i].id)
                if (cardSteps != null) {
                    cardSteps.classList.add('notVisible')
                    hideDetails.style.display = 'none'
                    showDetails.style.display = 'block'
                }
            }

        }
    })

    //print cards
    cardsToPrint.forEach(event => {

        //findout if video exists
        let findVideo
        if (videos.filter(video => video.video == (event.video + '.mp4')).length > 0) {
            findVideo = 1
        }else{
            findVideo = 0
        }

        //get event date
        const date = new Date(event.start_date_time * 1000)
        const eventDate = getDateByFromTimestamp(date)

        const line1 = '<div class="eventCard">'

        //div cards
        const line2 = '<div class="cardEventDataAndIcons">'
        const line3 = '<div class="cardEventData">'
        const line4 = '<div class="cardData"><b>EVENTO: </b>' + event.event + '</div>'
        const line5 = '<div class="cardData"><b>FECHA: </b>' + eventDate + '</div>'
        const line6 = '<div class="cardData"><b>DURACIÓN: </b>' + event.event_duration_seconds + ' seg.</div>'
        //const line7 = '<div class="cardData"><b>SCORE: </b>' + parseFloat(event.score,2).toFixed(2) + '</div>'
        const line8 = '</div>'

        //card icons
        const line9 = '<div class="cardIcons">'
        //const line10 = '<div><i class="fa-solid fa-location-dot cardIcon" id="cardIconLocation_' + event.id +'"></i></div>'
        const line11 = '<div><i class="fa-regular fa-eye cardIcon" id="cardIconEye_' + event.id +'"></i></div>'        
        
        let line12
        if (findVideo == 1) {
            line12 = '<div><a href="/events/download-video/' + event.video + '"><i class="fa-solid fa-download cardIcon" id="cardIconDownload_' + event.id +'"></i></a></div>'
        }else{
            line12 = '<div><i class="fa-solid fa-download cardIcon notVideoFound" id="cardIconDownload_' + event.id +'"></i></div>'
        }         
        
        const line13 = '<div><div><i class="fa-solid fa-chevron-down cardIcon" id="showDetails_' + event.id +'"></i></div>'
        const line14 = '<div><i class="fa-solid fa-chevron-up cardIcon" id="hideDetails_' + event.id +'"></i></div></div>'
        const line15 = '</div>'
        const line16 = '</div>'

        const line17 = '<div class="cardSteps notVisible" id="cardSteps_' + event.id + '">'

        const line18 = '<div class="cardData"><b>PASOS: </b></div>'

            //steps
            const line19 = '<div class="divSteps">'
            let line20 = ''
            event.steps.forEach(step => {

                const date = new Date(step.start_date_time * 1000)
                const stepDate = getDateByFromTimestamp(date)

                line20 += '<div class=divStepData>'
                line20 += '<div class="divStep"><b>' + step.step + ':</b></div>'
                line20 += '<div class="divDate">' + stepDate + '</div>'
                line20 += '<div class="divSpeed">' + step.speed + ' km/h</div>'
                line20 += '</div>'
            })
            line20 += '</div>'

        const line21 = '</div>'
        
        //show actions info
        const line22 = '<div class="showActionPopup pos1" id="viewMapInfo_' + event.id + '">Ver mapa</div>'
        const line23 = '<div class="showActionPopup pos2" id="viewVideoInfo_' + event.id + '">Ver video</div>'
        const line24 = '<div class="showActionPopup pos3" id="downloadVideoInfo_' + event.id + '">Descargar video</div>'
        const line25 = '<div class="showActionPopup pos4" id="showDetailsInfo_' + event.id + '">Mostrar detalles</div>'
        const line26 = '<div class="showActionPopup pos4" id="hideDetailsInfo_' + event.id + '">Ocultar detalles</div>'

        //video popup       
        const line27 = '<div class="infoPopup eventVideo" id="eventVideo_' + event.id + '">'
        const line28 = '<div class="closePopup" id="closeEventVideo_' + event.id + '">X</div>'
        const line29 = '<div class="titleS" id="vehicleCode_' + event.id + '">' + event.event + ' - Vehículo ' + event.vehicle_code + '</div>'        
        const line30 = '<div class="videoSubtitle" id="eventDate_' + event.id + '">' + 'Fecha: ' + eventDate + '</div>'
        const line31 = '<div class="divVideo" id="divVideo_' + event.id + '"></div>'
        const line32 = '</div>'

        //location popup
        const line33 = '<div class="infoPopup eventLocation" id="eventLocation_' + event.id + '">'
        const line34 = '<div class="closePopup" id="closeEventLocation_' + event.id + '">X</div>'
        const line35 = '<div class="titleS" id="eventVehicleCode_' + event.id + '">' + 'Vehículo ' + event.vehicle_code + '</div>'        
        const line36 = '<div class="videoSubtitle" id="eventLatLong_' + event.id + '">' + 'Lat,Long: ' + event.start_location_latitude + ',' + event.start_location_longitude + '</div>'
        const line37 = '<div class="eventLocationContainer" id="eventLocationContainer_' + event.id + '">'
        const line38 = '</div>'
        const line39 = '</div>'

        //end
        const line40 = '</div>'

        const cardHTML = line1 + line2 + line3 + line4 + line5 + line6 + /*line7 + */line8 + line9 + /*line10 + */line11 + line12 + line13 + line14 + line15 + line16 + line17 + line18 + line19 + line20 + line21 + line22 + line23 + line24 + line25 + line26 + line27 + line28 + line29 + line30 + line31 + line32 + line33 + line34 + line35 + line36 + line37 + line38 + line39 + line40
        eventsCards.innerHTML += cardHTML

    })

    //add event listeners
    cardsToPrint.forEach(event => {
        const cardIconLocation = document.getElementById('cardIconLocation_' + event.id)
        const cardIconEye = document.getElementById('cardIconEye_' + event.id)
        const cardIconDownload = document.getElementById('cardIconDownload_' + event.id)
        const showDetails = document.getElementById('showDetails_' + event.id)
        const hideDetails = document.getElementById('hideDetails_' + event.id)
        const cardSteps = document.getElementById('cardSteps_' + event.id)
        const eventVideo = document.getElementById('eventVideo_' + event.id)
        const eventLocation = document.getElementById('eventLocation_' + event.id)
        const closeEventVideo = document.getElementById('closeEventVideo_' + event.id)
        const closeEventLocation = document.getElementById('closeEventLocation_' + event.id)

        hideDetails.style.display = 'none'

        // cardIconLocation.addEventListener('click',async()=>{

        //     const eventLocationContainer = document.getElementById('eventLocationContainer_' + event.id)

        //     const line1 = '<gmp-map center="0, 0" zoom="13" map-id="locationMap_' + event.id +'" id="gmpMap2_' + event.id + '">'
        //     const line2 = '<gmp-advanced-marker position="0, 0" title="My location" id="gmpMapMarker2_' + event.id + '"></gmp-advanced-marker>'
        //     const line3 = '</gmp-map>'

        //     eventLocationContainer.innerHTML = line1 + line2 + line3

        //     //add map to div
        //     const gmpMap2 = document.getElementById('gmpMap2_' + event.id)
        //     const gmpMapMarker2 = document.getElementById('gmpMapMarker2_' + event.id)
        //     const latitude = parseFloat(event.start_location_latitude,20)
        //     const longitude = parseFloat(event.start_location_longitude,20)
        //     const centerCoordinates = { lat: latitude, lng: longitude }
        //     gmpMap2.center = centerCoordinates
        //     gmpMapMarker2.position = centerCoordinates

        //     closePopups(cardsToPrint,eventLocation)
        // })

        closeEventLocation.addEventListener('click',async()=>{
            const eventLocationContainer = document.getElementById('eventLocationContainer_' + event.id)
            eventLocationContainer.innerHTML = ''
            eventLocation.style.display = 'none'
        })

        closeEventVideo.addEventListener('click',async()=>{
            const divVideo = document.getElementById('divVideo_' + event.id)
            divVideo.innerHTML = ''
            eventVideo.style.display = 'none'
        })

        cardIconEye.addEventListener('click',async()=>{

            const divVideo = document.getElementById('divVideo_' + event.id)

            closePopups(cardsToPrint,eventVideo)

            const videoUrl = '/videos/' + event.video + '.mp4'

            $.ajax({
                url: videoUrl,
                type: 'HEAD',
                success: async function () {
                    const videoHTML = `
                        <video preload="none" class="video" id="videoPlayer" controls muted playsinline>
                            <source src="${videoUrl}" type="video/mp4" id="videoName">
                        </video>
                    `
                    divVideo.innerHTML = videoHTML

                    const videoPlayer = document.getElementById('videoPlayer')

                    eventLocation.style.display = 'none'
                    eventVideo.style.display = 'block'

                    setTimeout(() => {
                        try {
                            videoPlayer.load()
                            videoPlayer.play().catch(e => console.log('Play error:', e))
                        } catch (e) {
                            console.log('Error inesperado:', e)
                        }
                    }, 100)
                },
                error: function () {
                    divVideo.innerHTML = `
                        <div class="noVideoIcon"><i class="fa-solid fa-video-slash"></i></div>
                        <div class="noVideoText">Video no disponible</div>
                    `
                    eventLocation.style.display = 'none'
                    eventVideo.style.display = 'block'
                }
            })

            //add video to div            
            // $(document).ready(function() {

            //     const videoUrl = '/videos/' + event.video + '.mp4'

            //     $.ajax({
            //         url: videoUrl,
            //         type: 'HEAD',
            //         success: async function() {
            //             const line1 = '<video  preload="none" class="video" id="videoPlayer" controls muted playsinline>'
            //             const line2 = '<source src="/videos/' + event.video + '.mp4" type="video/mp4" id="videoName"></source>'
            //             const line3 = '</video>'
            //             divVideo.innerHTML = line1 + line2 + line3

            //             const videoPlayer = document.getElementById('videoPlayer')

            //             eventLocation.style.display = 'none'
            //             eventVideo.style.display = 'block'

            //             setTimeout(() => {
            //                 try {
            //                     videoPlayer.load()
            //                     videoPlayer.play().catch(e => console.log('Play() falló:', e))
            //                 } catch (e) {
            //                     console.log('Error inesperado:', e)
            //                 }
            //             }, 100)

                        
            //         },
            //         error: function() {
            //             const line1 = '<div class="noVideoIcon"><i class="fa-solid fa-video-slash"></i></div>'
            //             const line2 = '<div class="noVideoText">Video no disponible</div>'
            //             const line3 = ''
            //             divVideo.innerHTML = line1 + line2 + line3
                        
            //             eventLocation.style.display = 'none'
            //             eventVideo.style.display = 'block'
            //         }
            //     })
            // })

        })

        cardIconEye.addEventListener('mouseover',async()=>{
            const viewVideoInfo = document.getElementById('viewVideoInfo_' + event.id)
            viewVideoInfo.style.display = 'block'
        })

        cardIconEye.addEventListener('mouseout',async()=>{
            const viewVideoInfo = document.getElementById('viewVideoInfo_' + event.id)
            viewVideoInfo.style.display = 'none'
        })


        showDetails.addEventListener('click',async()=>{
            showDetails.style.display = 'none'
            hideDetails.style.display = 'block'
            cardSteps.classList.remove('notVisible')
        })

        showDetails.addEventListener('mouseover',async()=>{
            const showDetailsInfo = document.getElementById('showDetailsInfo_' + event.id)
            showDetailsInfo.style.display = 'block'
        })

        showDetails.addEventListener('mouseout',async()=>{
            const showDetailsInfo = document.getElementById('showDetailsInfo_' + event.id)
            showDetailsInfo.style.display = 'none'
        })

        hideDetails.addEventListener('click',async()=>{
            const showAllSteps = document.getElementById('showAllSteps')
            showAllSteps.checked = false
            hideDetails.style.display = 'none'
            showDetails.style.display = 'block'
            cardSteps.classList.add('notVisible')                        
        })

        hideDetails.addEventListener('mouseover',async()=>{
            const hideDetailsInfo = document.getElementById('hideDetailsInfo_' + event.id)
            hideDetailsInfo.style.display = 'block'
        })

        hideDetails.addEventListener('mouseout',async()=>{
            const hideDetailsInfo = document.getElementById('hideDetailsInfo_' + event.id)
            hideDetailsInfo.style.display = 'none'
        })

        // cardIconLocation.addEventListener('mouseover',async()=>{
        //     const viewMapInfo = document.getElementById('viewMapInfo_' + event.id)
        //     viewMapInfo.style.display = 'block'
        // })

        // cardIconLocation.addEventListener('mouseout',async()=>{
        //     const viewMapInfo = document.getElementById('viewMapInfo_' + event.id)
        //     viewMapInfo.style.display = 'none'
        // })

        cardIconDownload.addEventListener('click',async()=>{                        
            //downloadVideoInfo.style.display = 'none'
            eventVideo.style.display = 'none'
            eventLocation.style.display = 'none'
        })

        cardIconDownload.addEventListener('mouseover',async()=>{
            
            const findVideo = videos.filter(video => video.video == event.video + '.mp4')
            
            if (findVideo.length > 0) {
                const dowloadVideoInfo = document.getElementById('downloadVideoInfo_' + event.id)
                dowloadVideoInfo.style.display = 'block'
            }
        })

        cardIconDownload.addEventListener('mouseout',async()=>{
            const dowloadVideoInfo = document.getElementById('downloadVideoInfo_' + event.id)
            dowloadVideoInfo.style.display = 'none'
        })
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

function closePopups(cardsToPrint,popup) {
    const eventLocation = document.getElementById('eventLocation_' + event.id)
    const eventVideo = document.getElementById('eventVideo_' + event.id)

    cardsToPrint.forEach(card => {
        const cardEventLocation = document.getElementById('eventLocation_' + card.id)
        const cardEventVideo = document.getElementById('eventVideo_' + card.id)
        
        if (popup != cardEventLocation) {
            cardEventLocation.style.display = 'none'
        }

        if (popup != cardEventVideo) {
            cardEventVideo.style.display = 'none'
        }

        popup.style.display = 'block'
    })

}



export {printTable,printCards,getDateByFromTimestamp}