// kết nối nodejs với mongodb
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://hoangviet:123a@cluster0.a7ff2lm.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Kết nối DB thành công!'))
    .catch(() => console.log('Kết nối thất bại!'))