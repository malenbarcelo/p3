const db = require('../../database/models')
const sequelize = require('sequelize')
const vehiclesQueries = require('./dbQueries/vehiclesQueries')
const detectedEventsQueries = require('./dbQueries/detectedEventsQueries')

const apisController = {
  allVehicles: async(req,res) =>{
    try{

      const allVehicles = await vehiclesQueries.allVehicles()
      const allDetectedEvents = await detectedEventsQueries.allDetectedEvents()

      for (let i = 0; i < allVehicles.length; i++) {
        const vehicleEvents = allDetectedEvents.filter(event => event.vehicle_code == allVehicles[i].vehicle_code)
        allVehicles[i].detectedEvents = vehicleEvents        
      }

      res.status(200).json(allVehicles)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  allDetectedEvents: async(req,res) =>{
    try{

      const allDetectedEvents = await detectedEventsQueries.allDetectedEvents()

      res.status(200).json(allDetectedEvents)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  sendVehicleData: async(req,res) =>{
    try{

      const data = req.body
      const findVehicle = await vehiclesQueries.findVehicle(data.vehicle_code)

      if (findVehicle.length == 0) {
        //create new vehicle
        await vehiclesQueries.createVehicleData(data)
      }else{
        //update vehicle data
        await vehiclesQueries.updateVehicleData(data)
      }      
      
      res.status(200).json( )

      console.log("Datos enviados correctamente")

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  sendEvents: async(req,res) =>{
    try{

      const data = req.body

      //crete detected_event

      await detectedEventsQueries.createDetectedEvent(data)

      //get created event data
      const detectedEventData = await detectedEventsQueries.findEvent(data)
      const eventId = detectedEventData.id

      //carete detected_events_steps
      await detectedEventsQueries.createDetectedEventSteps(data.steps_data,eventId)

      res.status(200).json()

      console.log("Datos enviados correctamente")

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  saveVideo: async(req,res) =>{
    try{

      const data = req.body
      data.video = req.file.filename

      res.status(200).json({ message: 'Video cargado exitosamente', filename: req.file.filename })

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisController

