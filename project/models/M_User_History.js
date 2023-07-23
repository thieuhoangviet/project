const mongoose = require('mongoose');

const userHistorySchema = mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, default: null },
    content: { type: Array, default: [] },
    date_updated: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('userHistory', userHistorySchema)