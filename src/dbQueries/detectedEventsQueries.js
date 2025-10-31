const db = require('../../database/models')
const { sequelize, Op } = require('sequelize')
const model = db.Detected_events

const detectedEventsQueries = {
    get: async({ limit, offset, filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        //where
        const where = {}

        if (filters.id_vehicles) {
            where.id_vehicles = filters.id_vehicles
        }

        // duration where
        const durArr = []
        if (filters.duration_min) {
            durArr.push({ [Op.gte]: Number(filters.duration_min) })
        }

        if (filters.duration_max    ) {
            durArr.push({ [Op.lte]: Number(filters.duration_max) })
        }

        if (durArr.length) {
            where.duration_seconds = { [Op.and]: durArr }
        }

        // start_timestamp where
        const tiemstampArr = []
        if (filters.date_from) {
            tiemstampArr.push({ [Op.gte]: Number(filters.date_from) })
        }

        if (filters.date_until    ) {
            tiemstampArr.push({ [Op.lte]: Number(filters.date_until) })
        }

        if (tiemstampArr.length) {
            where.start_timestamp = { [Op.and]: tiemstampArr }
        }

        const data = await model.findAndCountAll({
            include:[{association:'vehicle_data'}],
            order,
            where,
            limit,
            offset,
            raw:true,
            nest:true
        })

        return data
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
}       

module.exports = detectedEventsQueries