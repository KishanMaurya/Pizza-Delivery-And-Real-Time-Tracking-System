const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs')
const path = require('path')
const PORT = process.env.PORT || 3000


//Assets
app.use(express.static('public'))
app.use(expressLayouts)
app.set('views',path.join(__dirname , '/resources/views'))
app.set('view engine' , 'ejs')

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/cart', (req,res) =>{
  res.render('customers/cart')
})

app.get('/register' , (req , res)=>{
  res.render('auth/register')
})

app.get('/login' , (req , res) =>{
  res.render('auth/login')
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})