const express = require('express')
const vehiclesController = require('../controllers/vehiclesController.js')
const router = express.Router()

router.get('/vehicles-data',vehiclesController.vehicles)

module.exports = router
