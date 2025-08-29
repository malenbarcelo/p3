const db = require('../../../database/models')
const sequelize = require('sequelize')

const detectedEventsQueries = {
    allDetectedEvents: async() => {
        const allDetectedEvents = await db.Detected_events.findAll({
            order:[['start_date_time','DESC']],
            raw:true
        })

        //add steps
        for (let i = 0; i < allDetectedEvents.length; i++) {
            const detectedEventSteps = await db.Detected_events_steps.findAll({
                where:{'id_detected_events': allDetectedEvents[i].id}
            })

            allDetectedEvents[i].steps = detectedEventSteps
            
        }
        return allDetectedEvents
    },
    findEvent: async(data) => {
        const findEvent = await db.Detected_events.findOne({
            where:{
                'vehicle_code':data.vehicle_code,
                'start_date_time':data.start_date_time
            },
            raw:true
        })
        return findEvent
    },
    createDetectedEvent: async(data) => {
        await db.Detected_events.create({
            vehicle_code:data.vehicle_code,
            event:data.event,
            start_date_time:data.start_date_time,
            start_location_latitude:data.start_location_latitude,
            start_location_longitude:data.start_location_longitude,
            event_duration_seconds:data.event_duration_seconds,
            score:data.score,
            video: 'r_' + data.vehicle_code + '_' + data.start_date_time
        })
    },
    createDetectedEventSteps: async(data,idEvent) => {

        for (let i = 0; i < data.length; i++) {
            await db.Detected_events_steps.create({
                id_detected_events:idEvent,
                step:data[i].step,
                start_location_latitude:data[i].start_location_latitude,
                start_location_longitude:data[i].start_location_longitude,
                start_date_time:data[i].start_date_time,
                speed:data[i].speed            
            })
        }
    },
}       

module.exports = detectedEventsQueries