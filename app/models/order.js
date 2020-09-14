const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:{ type: Object, required:true},
    phone:{ type: Number, required:true},
    address:{ type: String, required:true},
    paymentType:{ type: String, default:'COD'},
    status:{ type: String, default:'Order placed..!'}
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order