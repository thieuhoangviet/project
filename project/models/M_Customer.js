// kết nối nodejs với mongodb
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    address: { type: String, default: '' },
    note: { type: String, default: '' },

    // thêm 1 số thuộc tính
    status: { type: Boolean, default: false },
    trash: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('customer', customerSchema)