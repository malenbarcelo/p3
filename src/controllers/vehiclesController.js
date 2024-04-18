const db = require('../../database/models')

const vehiclesController = {
    vehicles: async(req,res) => {
        try{

            return res.render('vehicles',{title:'Vehículos'})

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
}

module.exports = vehiclesController

