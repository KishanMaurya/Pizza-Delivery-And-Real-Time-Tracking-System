const homeController = require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController')
const cartController = require('../app/http/controller/customers/cartController')
const orderController = require('../app/http/controller/customers/orderController')
const adminOderController = require('../app/http/controller/admin/orderControlller')
const statusController = require('../app/http/controller/admin/statusController')
// middleware
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app){

    app.get('/', homeController().index)
    app.get('/cart', cartController().index)
    app.get('/register', guest , authController().register)
    app.post('/register' , authController().postRegister)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.post('/update-cart', cartController().update)
    app.post('/logout' , authController().logout)
    
    //customer routes
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:id',auth, orderController().show)
    app.post('/orders',auth, orderController().store)
    
    //admin section
    app.get('/admin/orders',admin,adminOderController().index)
    app.post('/admin/order/status',admin,statusController().update)
}

module.exports=initRoutes