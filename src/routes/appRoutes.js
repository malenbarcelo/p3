const express = require('express')
const appController = require('../controllers/appController.js')
const loginFormValidations = require('../validations/loginFormValidations.js')

const router = express.Router()

///// login
router.get('/',appController.login)
router.get('/login',appController.login)
router.post('/login',loginFormValidations.login,appController.loginProcess)
router.get('/logout',appController.logout)

///// vehicles
router.get('/vehiculos',appController.vehicles)

///// statistics
router.get('/dashboard',appController.dashboard)




module.exports = router



