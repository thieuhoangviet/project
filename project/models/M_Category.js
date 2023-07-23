const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, default: null },
    parentsID: { type: mongoose.Types.ObjectId, default: null },
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    avatar: { type: String, default: '' },
    arrange: { type: Number, default: 0 },
    description: { type: String, default: '' },
    content: { type: String, default: '' },

    // thêm 1 số thuộc tính
    status: { type: Boolean, default: false },
    trash: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('category', categorySchema)