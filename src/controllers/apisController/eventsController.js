
const detectedEventsQueries = require("../../dbQueries/detectedEventsQueries")
const companiesProjectsQueries = require("../../dbQueries/companiesProjectsQueries")
const vehiclesQueries = require("../../dbQueries/vehiclesQueries")

const eventsController = {
    sendEvents: async(req,res) =>{
        try{

            const data = req.body
            const dataToCreate = {
                start_timestamp: data.start_date_time,
                duration_seconds: data.event_duration_seconds,
                video: 'r' + data.vehicle_code + '_' + data.start_date_time
            }

            // get date
            const date = new Intl.DateTimeFormat('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(new Date(data.start_date_time * 1000)).split(', ')

            // get vehicle
            const vehicleData = await vehiclesQueries.get({filters:{exact_vehicle_code:data.vehicle_code}})
            if (vehicleData.rows.length > 0) {
                dataToCreate.id_vehicles = vehicleData.rows[0].id
            }else{
                
                // find company
                const project = data.vehicle_code.split('_')[0]
                const companyProject = await companiesProjectsQueries.get({filters:{project: project}})
                const idCompanies = companyProject.length > 0 ? companyProject[0].id_companies : 1 // if project doesn't exist complets with Schema

                // create vehicle
                const createdVehicle = await vehiclesQueries.create([{vehicle_code:data.vehicle_code,id_companies:idCompanies}])
                dataToCreate.id_vehicles = createdVehicle[0].id
            }

            // add date
            dataToCreate.date = date[0]
            dataToCreate.time = date[1]
            

            // create event
            await detectedEventsQueries.create([dataToCreate])
            
            // response
            res.status(200).json({message:'Datos creados con éxito'})

        }catch(error){
            console.log(error)
            res.json({message:'Error al crear los datos'})
        }
    },
    saveVideo: async(req,res) =>{
    try{

      const data = req.body
      data.video = req.file.filename

      res.status(200).json({ message: 'Video cargado exitosamente', filename: req.file.filename })

    }catch(error){
      console.group(error)
      res.json({message:'Error al guardar el video'})
    }
  },
}
module.exports = eventsController

