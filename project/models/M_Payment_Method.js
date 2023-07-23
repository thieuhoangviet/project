const mongoose = require('mongoose');

const paymentMethodSchema = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    fee: { type: String, default:'' },
    status: { type: Boolean, default: false },
})

module.exports = mongoose.model('payment_method', paymentMethodSchema)