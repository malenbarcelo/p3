const db = require('../../../database/models')
const sequelize = require('sequelize')

const vehiclesQueries = {
    allVehicles: async() => {
        const allVehicles = await db.Vehicles.findAll({
            order:[['last_actualization','DESC']],
            raw:true
        })
        return allVehicles
    },
    findVehicle: async(vehicleCode) => {
        const findVehicle = await db.Vehicles.findAll({
            order:['vehicle_code'],
            where:{vehicle_code:vehicleCode},
            raw:true
        })
        return findVehicle
    },
    createVehicleData: async(data) => {
        await db.Vehicles.create({
            vehicle_code:data.vehicle_code,
            last_location_latitude:data.last_location_latitude,
            last_location_longitude:data.last_location_longitude,
            last_actualization:data.last_actualization,
        })
    },
    updateVehicleData: async(data) => {
        await db.Vehicles.update(
            {
                last_location_latitude:data.last_location_latitude,
                last_location_longitude:data.last_location_longitude,
                last_actualization:data.last_actualization,
            },
            {where:{vehicle_code:data.vehicle_code}}
    )},
}       

module.exports = vehiclesQueries