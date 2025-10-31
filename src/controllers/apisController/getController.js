const vehiclesQueries = require("../../dbQueries/vehiclesQueries")
const gf = require("../../functions/globalFunctions")

const getController = {
    vehicles: async(req,res) =>{
        try{

            const { page, size, vehicle_code, id_companies, id, enabled, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // filter user
            if (req.session.userLogged && req.session.userLogged.id_users_categories != 1) {
                filters.id_companies = req.session.userLogged.id_companies
            }

            // add filters
            if (enabled) {
                filters.enabled = enabled
            }

            if (vehicle_code) {
                filters.vehicle_code = vehicle_code
            }

            if (id_companies) {
                filters.id_companies = id_companies
            }

            if (id) {
                filters.id = id
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            let data = await vehiclesQueries.get({ limit, offset, filters })

            // get plain data
            data = {
                count: data.count,
                rows: data.rows.map(r => r.get({ plain: true }))
            }

            //get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    detectedEvents: async(req,res) =>{
        try{

            const { page, size, id_vehicles, date_from, date_until, duration_min, duration_max, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (id_vehicles) {
                filters.id_vehicles = id_vehicles
            }

            if (date_from) {
                filters.date_from = date_from
            }

            if (date_until) {
                filters.date_until = date_until
            }

            if (duration_min) {
                filters.duration_min = duration_min
            }

            if (duration_max) {
                filters.duration_max = duration_max
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            let data = await gf.getDetectedEvents(limit, offset, filters)

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getController

