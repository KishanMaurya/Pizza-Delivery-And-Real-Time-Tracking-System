require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs')
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const MongoDbStore = require('connect-mongo')(session)
const Emitter = require('events')

//Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:true
});

const connection = mongoose.connection;
connection.once('open', ()=>{
  console.log('Database connected')
}).catch(err =>{
  console.log("connection field"+err)
})


//session store
let mongoStore = new MongoDbStore({
  mongooseConnection:connection,
  collection:'session'
})
//Emmiter

const eventsEmitter = new Emitter()
app.set('eventEmitter',eventsEmitter)

//session config
app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave:false,
  store:mongoStore,
  saveUninitialized:false,
  cookie : {maxAge:1000 * 60 * 60 * 24}//24 hours
}))

//local stratgi
const passportInit = require('./app/config/passport');
const { Socket } = require('dgram');
passportInit(passport)
//passport config
app.use(passport.initialize())
app.use(passport.session())



app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res , next) =>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

app.use(expressLayouts)
app.set('views',path.join(__dirname , '/resources/views'))
app.set('view engine' , 'ejs')

require('./routes/web')(app)

const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
  socket.on('join',(orderId)=>{
    socket.join(orderId)
  })
})

eventsEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventsEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data)
})