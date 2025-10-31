const getController = require('../../controllers/apisController/getController')
const express = require('express')
const router = express.Router()

// vehicles
router.get('/vehicles',getController.vehicles)
router.get('/detected-events',getController.detectedEvents)

module.exports = router



