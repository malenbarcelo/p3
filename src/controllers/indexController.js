const db = require('../../database/models')
const {validationResult} = require('express-validator')
const usersQueries = require('../controllers/dbQueries/usersQueries')

const usersController = {
    login: (req,res) => {
        try{
            req.session.destroy()

            return res.render('login',{title:'Login'})
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    loginProcess: async(req,res) => {
        try{

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            //login
            const userToLogin = await usersQueries.findUser(req.body.userName)

            delete userToLogin.password
            req.session.userLogged = userToLogin



            return res.redirect('/vehicles/vehicles-data')

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },logout: (req,res) => {

        req.session.destroy()

        return res.redirect('/')
    },
    
}

module.exports = usersController

