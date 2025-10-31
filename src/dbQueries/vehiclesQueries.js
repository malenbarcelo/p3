const db = require('../../database/models')
const { sequelize, Op } = require('sequelize')
const gf = require('../functions/globalFunctions')
const model = db.Vehicles

const vehiclesQueries = {
    get: async({ limit, offset, filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        //where
        const where = {}

        if (filters.id_companies) {
            where.id_companies = filters.id_companies
        }

        if (filters.id) {
            where.id = filters.id
        }

        if (filters.vehicle_code) {
            where.vehicle_code = {
                [Op.like]: `%${gf.specialChars(filters.vehicle_code)}%`
            }
        }

        if (filters.exact_vehicle_code) {
            where.vehicle_code = filters.exact_vehicle_code
        }

        const data = await model.findAndCountAll({
            include: [
                {
                    association: 'company_data'
                },
                {
                    association: 'detected_events',
                    order: [['id',"DESC"]],
                    limit:1
                }
            ],
            order,
            where,
            limit,
            offset,
            nest:true
        })

        return data
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
}       

module.exports = vehiclesQueries