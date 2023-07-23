// kết nối nodejs với mongodb
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, default: '' },
    // username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    address: { type: String, default: '' },
    avatar: { type: String, default: '' },
    age: { type: Number, default: 0 },
    role: { type: String, default: '' },
    gender: { type: String, default: '' },
    birthday: { type: Date, default: null },

    // thêm 1 số thuộc tính
    status: { type: Boolean, default: false },
    trash: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('user', userSchema)