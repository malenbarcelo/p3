const db = require('../../database/models')
const path = require('path')

const eventsController = {
    events: async(req,res) => {
        try{

            return res.render('events',{title:'Eventos'})

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
    downloadVideo: async(req,res) => {
        try{
            const videoName = req.params.videoName;
            var videoPath = path.resolve('./public/videos/' + videoName + '.mp4')

            res.download(videoPath, videoName)

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
}

module.exports = eventsController

