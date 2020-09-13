const homeController = require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController')
const cartController = require('../app/http/controller/customers/cartController')
// const gust = require('../app/http/middleware/guest')
const guest = require('../app/http/middleware/guest')
function initRoutes(app){

    app.get('/', homeController().index)
    app.get('/cart', cartController().index)
    app.get('/register', guest , authController().register)
    app.post('/register' , authController().postRegister)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.post('/update-cart', cartController().update)
    app.post('/logout' , authController().logout)

}

module.exports=initRoutes