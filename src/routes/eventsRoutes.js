const express = require('express')
const eventsController = require('../controllers/eventsController.js')
const router = express.Router()

router.get('/events-data',eventsController.events)
router.get('/download-video/:videoName',eventsController.downloadVideo)

module.exports = router
