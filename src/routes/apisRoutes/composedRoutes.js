const dashboardController = require('../../controllers/apisController/dashboardController')
const eventsController = require('../../controllers/apisController/eventsController')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/videos')) 
    },
    filename: function (req, file, cb) {     
      const fileExtension = path.extname(file.originalname)
      const fileName = file.originalname.replace(fileExtension,'')
      cb(null, fileName + fileExtension)
    }
})

const upload = multer({storage: storage})

// dashboard
router.get('/days-events',dashboardController.daysEvents)
router.get('/weeks-events',dashboardController.weeksEvents)
router.get('/months-events',dashboardController.monthsEvents)

// send events
router.post('/send-events',eventsController.sendEvents)

// upload video
router.post('/upload-video', upload.single('video'),eventsController.saveVideo)

module.exports = router



