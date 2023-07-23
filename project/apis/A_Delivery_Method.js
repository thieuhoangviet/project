const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
// Gọi Models
const M_Delivery_Method = require('../models/M_Delivery_Method');

router.get('/getList', async (req, res) => {
    const data = await M_Delivery_Method.find({}).exec()

    res.send({
        message: 'Success',
        code : 200,
        data
     })
})
router.post('/add', async (req, res) => {
    const name = req.body.name;
    const fee = req.body.fee;

    const object = {}

    object['name']= name;

    if(fee != undefined) object['fee'] = parseInt(fee)

    const data =await M_Delivery_Method.create(object)
    res.send({
        message: 'Success',
        code : 200,
        data
     })

})

router.post('/edit', function (req, res) {
    res.send('POST request to the homepage')
})

router.post('/delete', async (req, res) =>{

    const data = await M_Delivery_Method.deleteMany()
    res.send({
        message: 'Success',
        code : 200,
        data : {
            title: 'Đã xóa tất cả dữ liệu',
            listData : data
        }
     })
})

module.exports = router