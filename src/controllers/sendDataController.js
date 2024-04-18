const db = require('../../database/models')

const sendDataController = {
    vehiclesData: async(req,res) => {
        try{

            return res.render('sendData',{title:'Enviar datos'})

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
}

module.exports = sendDataController

