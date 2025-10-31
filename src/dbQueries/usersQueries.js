const db = require('../../database/models')
const { sequelize, Op } = require('sequelize')
const model = db.Users

const usersQueries = {
    get: async({ limit, offset, filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        //where
        const where = {}

        if (filters.email) {
            where.email = filters.email
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        if (filters.id_companies) {
            where.id_companies = filters.id_companies
        }

        const data = await model.findAndCountAll({
            order,
            where,
            limit,
            offset,
            raw:true,
            nest:true
        })

        return data
    },
}       

module.exports = usersQueries