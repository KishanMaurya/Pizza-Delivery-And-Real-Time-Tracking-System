const Order = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return{
        store(req,res){
            // console.log(req.body)
            const {phone , address} = req.body
            if(!phone || !address){
                res.flash('error','All fields all required')
                return res.redirect('/cart')
            }
             const order = new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                address:address
             })

             order.save().then(result=>{
                req.flash('success','Order placed successfully.!')
                delete req.session.cart
                return res.redirect('/customer/orders')
             }).catch(err=>{
                console.log(err)
                req.flash('error','something went wrong.!')
                return res.redirect('/cart')
             })
        },
        async index(req,res){
            const orders = await Order.find({customerId: req.user._id },null,
                {sort:{'createdAt':-1}})
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders', { orders:orders, moment:moment})
        }
    }
}

module.exports = orderController