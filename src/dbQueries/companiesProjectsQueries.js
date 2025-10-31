const db = require('../../database/models')
const model = db.Companies_projects

const companiesProjects = {
    get: async({filters }) => {

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

        if (filters.project) {
            where.project = filters.project
        }

        const data = await model.findAll({            
            order,
            where,
            raw:true
        })

        return data
    },
}       

module.exports = companiesProjects