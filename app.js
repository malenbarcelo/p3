const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const cors = require('cors')

// routes
const appRoutes = require('./src/routes/appRoutes.js')
const getRoutes = require('./src/routes/apisRoutes/getRoutes.js')
const composedRoutes = require('./src/routes/apisRoutes/composedRoutes.js')
const { time } = require('console')

const isProd = process.env.NODE_ENV === 'production'

// CORSallow: subdomainse p3.com/p3.host, *.localhost, *.127.0.0.1.nip.io
//const ORIGIN_RE = /^https?:\/\/([a-z0-9-]+\.)?(p3\.com|p3\.host|localhost|127\.0\.0\.1\.nip\.io)(:\d+)?$/i
const ORIGIN_RE = /^https?:\/\/([a-z0-9-]+\.)*(p3\.com|p3\.host|p3\.wnpower\.com|p3\.wnpower\.host|localhost|127\.0\.0\.1\.nip\.io)(:\d+)?$/

const extraOrigins = (process.env.CORS_EXTRA_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)      // curl / same-origin
    if (ORIGIN_RE.test(origin)) return cb(null, true)
    if (extraOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Origen no permitido por CORS'))
  },
  credentials: true,                         // necesario si usás cookies/sesión
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'] // si necesitás leerlos
}

// continue
const app = express()

// importante: aplicarlo antes de tus rutas
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))

app.set('trust proxy', 1) // if Cloudflare/NGINX 

// unable cache
app.disable('etag')
app.set('view cache', false)
app.locals.assetV = new Date().toISOString().slice(0,10) // '2025-10-24'

// middleware global anti-cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  // Opcional si usás un CDN: ayuda a que respete cookies de sesión
  res.set('Vary', 'Cookie')
  next()
})

// brands
app.locals.brands = {
  aesa: { name: 'AESA', id: 3, favicon: '/images/favicon3.jpg', logo: '/images/companyLogo3.svg', css: '/css/specific/company3Styles.css'},
  techint: { name: 'Techint - SACDE', id: 2, favicon: '/images/favicon3.jpg', logo: '/images/companyLogo3.svg', css: '/css/specific/company3Styles.css'},
  schema: { name: 'SCHEMA', id: 1, favicon: '/images/favicon1.jpg', logo: '/images/companyLogo1.jpg', css: '/css/specific/company1Styles.css' },
  default:{ name: 'SCHEMA',id: 1, favicon: '/images/favicon1.jpg', logo: '/images/companyLogo1.jpg', css: '/css/specific/company1Styles.css' }
}

// brands middlewares
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0]      // delete port
  let sub = host.split('.')[0]                              // aesa.p3.com → 'aesa'
  if (!sub || sub === 'www') sub = 'default'

  // soporta dev con subdominios: aesa.localhost, schema.localhost
  if (host.endsWith('.localhost')) sub = host.split('.')[0]

  const brands = req.app.locals.brands
  const brand = brands[sub] || brands.default

  res.locals.tenant = sub
  res.locals.brand = brand
  res.locals.assetV = req.app.locals.assetV
  req.brand  = brand
  next()
})

//use public as statis without cache
app.use(express.static(publicPath, {
  etag: false,
  lastModified: false,
  cacheControl: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
  }
}))

//get forms info as objects
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
}))

// middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3013
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',appRoutes)
app.use('/get',getRoutes)
app.use('/composed',composedRoutes)
app.use('/apis',composedRoutes)


//console.log('malen: ' + bcrypt.hashSync('jaime',10))

// const dateString = '28/10/2025'
// const [dia, mes, año] = dateString.split('/')
// const date = new Date(`${año}-${mes}-${dia}T00:00:00-03:00`) // hora argentina
// const timestamp = Math.floor(date.getTime() / 1000)
// console.log(timestamp)