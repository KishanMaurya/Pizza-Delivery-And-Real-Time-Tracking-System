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
const MongoDbStore = require('connect-mongo')(session)
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

//session config
app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave:false,
  store:mongoStore,
  saveUninitialized:false,
  cookie : {maxAge:1000 * 60 * 60 * 24}//24 hours
}))

app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.json())

app.use((req, res , next) =>{
  res.locals.session = req.session
  next()
})

app.use(expressLayouts)
app.set('views',path.join(__dirname , '/resources/views'))
app.set('view engine' , 'ejs')

require('./routes/web')(app)

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})