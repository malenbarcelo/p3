const db = require('../../database/models')
const { sequelize, Op } = require('sequelize')
const model = db.Companies

const companiesQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        //where
        const where = {}

        const data = await model.findAll({
            order,
            where,
            raw:true
        })

        return data
    },
}       

module.exports = companiesQueries