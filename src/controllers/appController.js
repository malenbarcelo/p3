const bottomHeaderMenu = require("../data/bottomHeaderMenu.js")
const usersQueries = require("../dbQueries/usersQueries")
const companiesQueries = require("../dbQueries/companiesQueries")
const { validationResult } = require('express-validator')

const appController = {
    // login
    login: (req,res) => {
        try{
            req.session.destroy()
            return res.render('login/login',{title:'P3 - Login'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // login process
    loginProcess: async(req,res) => {
        try{

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('login/login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            //login
            const userToLogin = await usersQueries.get({filters:{email:req.body.email,enabled:1}})
            delete userToLogin.password
            req.session.userLogged = userToLogin.rows[0]
            
            return res.redirect('/vehiculos')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // logout
    logout: async(req,res) => {
        try{

            req.session.destroy()
            
            return res.redirect('/')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // vehicles
    vehicles: async(req,res) => {
        try{
            console.log(req.session.userLogged)
            
            const selectedItem = 'VEHÍCULOS'
            let companies = await companiesQueries.get({filters:{order:[["company","ASC"]]}})
            companies = (!req.session.userLogged || req.session.userLogged.id_users_categories) == 1 ? companies.filter(c => c.company != 'Schemasim') : []
            return res.render('vehicles/vehicles',{title:'P3 - Vehículos',bottomHeaderMenu,selectedItem, companies})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // dashboard
    dashboard: async(req,res) => {
        try{
            const selectedItem = 'DASHBOARD'
            return res.render('dashboard/dashboard',{title:'P3 - Dashboard',bottomHeaderMenu,selectedItem})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = appController

