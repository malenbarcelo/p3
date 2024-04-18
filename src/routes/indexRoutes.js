const express = require('express')
const indexController = require('../controllers/indexController.js')
const userFormsValidations = require('../validations/userFormsValidations.js')
const router = express.Router()

router.get('/',indexController.login)
router.post('/vehicles/vehicles-data',indexController.loginProcess)

module.exports = router

