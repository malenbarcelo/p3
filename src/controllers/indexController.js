const db = require('../../database/models')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

const usersController = {
    login: (req,res) => {
        try{
            return res.render('login',{title:'Login'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    loginProcess: async(req,res) => {
        try{

            /*const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('users/login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            //login
            const userToLogin = await usersQueries.findUser(req.body.userName)

            delete userToLogin.password
            req.session.userLogged = userToLogin

            if (req.body.userName == req.body.password) {
                return res.render('users/changePassword',{
                    title:'Cambio de contraseña',
                    changePasswordMessage: true,
                    userToLogin
                })
            }*/

            return res.redirect('/vehicles/vehicles-data')

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
    
    /*logout: (req,res) => {

        req.session.destroy()

        return res.redirect('/')
    },
    changePasswordProcess: async(req,res) => {
        try{
            const data = await getData()

            const userToLogin = await usersQueries.findUser(req.body.userName)

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('users/changePassword',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Cambiar contraseña',
                    userToLogin
                })
            }

            const newPassword = bcrypt.hashSync(req.body.password,10)
            
            await usersQueries.changePassword(userToLogin.user_name,newPassword)

            delete userToLogin.password
            req.session.userLogged = userToLogin

            const successMessage = true

            return res.render('selectBrunch',{title:'Sucursal',data,successMessage})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },*/
}

module.exports = usersController

