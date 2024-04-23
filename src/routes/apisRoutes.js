const express = require('express')
const apisController = require('../controllers/apisController.js')
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

router.get('/vehicles-data',apisController.allVehicles)
router.get('/detected-events-data',apisController.allDetectedEvents)
router.post('/send-vehicle-data',apisController.sendVehicleData)
router.post('/send-events',apisController.sendEvents)
router.post('/upload-video', upload.single('video'),apisController.saveVideo)
router.get('/all-videos',apisController.getVideos)

module.exports = router

