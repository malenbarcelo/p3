const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const indexRoutes = require('./src/routes/indexRoutes.js')
const apisRoutes = require('./src/routes/apisRoutes.js')
const vehiclesRoutes = require('./src/routes/vehiclesRoutes.js')
const eventsRoutes = require('./src/routes/eventsRoutes.js')
const sendDataRoutes = require('./src/routes/sendDataRoutes.js')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const bodyParser = require("body-parser")
const cors = require('cors');

const app = express()

//use public as statis
app.use(express.static(publicPath))

//use cors to allow any website to connet to my app
app.use(cors())

// Middleware para permitir CORS
app.use('/acec93ee08.js', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3004');
    next();
});

//get forms info as objects
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
//app.use(express.urlencoded({ limit: "10000kb", extended: true }))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3004
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',indexRoutes)
app.use('/apis',apisRoutes)
app.use('/vehicles',vehiclesRoutes)
app.use('/events',eventsRoutes)
app.use('/send-data',sendDataRoutes)


/*console.log('malen: ' + bcrypt.hashSync('malen',10))
console.log('fran: ' + bcrypt.hashSync('francisco',10))*/
