const mongoose = require('mongoose');

const deliveryMethodSchema = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    fee: { type: Number, default:'' },
    status: { type: Boolean, default: true },
})

module.exports = mongoose.model('delivery_method', deliveryMethodSchema)