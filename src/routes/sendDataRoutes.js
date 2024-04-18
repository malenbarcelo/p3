const express = require('express')
const sendDataController = require('../controllers/sendDataController.js')
const router = express.Router()

router.get('/vehicles',sendDataController.vehiclesData)

module.exports = router

