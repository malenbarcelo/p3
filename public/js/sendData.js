import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    //Buttons    
    const sendVehicleData = document.getElementById('sendVehicleData')
    const sendEventData = document.getElementById('sendEventData') 

    sendVehicleData.addEventListener('click',async()=>{
        const vehicle = document.getElementById('vehicle').value
        const latitude = document.getElementById('latitude').value
        const longitude = document.getElementById('longitude').value
        const datetime = document.getElementById('datetime').value

        const data = {
            'vehicle_code':vehicle,
            'last_location_latitude':latitude,
            'last_location_longitude':longitude,
            'last_actualization':datetime
        }

        await fetch(dominio + 'apis/send-vehicle-data',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
    }),

    sendEventData.addEventListener('click',async()=>{
        const vehicle = document.getElementById('eventVehicle').value
        const event = document.getElementById('event').value
        const latitude = document.getElementById('eventLatitude').value
        const longitude = document.getElementById('eventLongitude').value
        const datetime = document.getElementById('eventDatetime').value
        const duration = document.getElementById('duration').value
        const step1 = document.getElementById('step1').value
        const stepLatitude1 = document.getElementById('stepLatitude1').value
        const stepLongitude1 = document.getElementById('stepLongitude1').value
        const stepDatetime1 = document.getElementById('stepDatetime1').value
        const stepSpeed1 = document.getElementById('stepSpeed1').value
        const step2 = document.getElementById('step2').value
        const stepLatitude2 = document.getElementById('stepLatitude2').value
        const stepLongitude2 = document.getElementById('stepLongitude2').value
        const stepDatetime2 = document.getElementById('stepDatetime2').value
        const stepSpeed2 = document.getElementById('stepSpeed2').value
        const step3 = document.getElementById('step3').value
        const stepLatitude3 = document.getElementById('stepLatitude3').value
        const stepLongitude3 = document.getElementById('stepLongitude3').value
        const stepDatetime3 = document.getElementById('stepDatetime3').value
        const stepSpeed3 = document.getElementById('stepSpeed3').value

        const stepsData = [
            {
                'step':step1,
                'start_location_latitude':stepLatitude1,
                'start_location_longitude':stepLongitude1,
                'start_date_time':stepDatetime1,
                'speed':stepSpeed1
            },
            {
                'step':step2,
                'start_location_latitude':stepLatitude2,
                'start_location_longitude':stepLongitude2,
                'start_date_time':stepDatetime2,
                'speed':stepSpeed2
            },
            {
                'step':step3,
                'start_location_latitude':stepLatitude3,
                'start_location_longitude':stepLongitude3,
                'start_date_time':stepDatetime3,
                'speed':stepSpeed3
            },

        ]

        const data = {
            'vehicle_code':vehicle,
            'event':event,
            'start_date_time':datetime,
            'start_location_latitude':latitude,
            'start_location_longitude':longitude,
            'event_duration_seconds':duration,
            'steps_data':stepsData
        }

        await fetch(dominio + 'apis/send-events',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
    })

    
})