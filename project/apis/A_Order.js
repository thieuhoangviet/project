const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose');

var nodemailer = require('nodemailer');

const ObjectId = mongoose.Types.ObjectId;
// Gọi Models
const M_Order = require('../models/M_Order');
const M_Customer = require('../models/M_Customer');

router.post('/add', async (req, res) => {
  const idCustomer = req.body.idCustomer;
  const idPayment = req.body.idPayment;
  const idDelivery = req.body.idDelivery;
  const detail = req.body.detail; 
  const sumTotal = req.body.sumTotal;

  const object = {
    idCustomer,
    idDelivery,
    idPayment,
    detail,
    sumTotal
  }

  const data = await M_Order.create(object)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'thieuhoangviet63@gmail.com',
      pass: 'xuwfvjobnbybmhps'
    }
  });



  if (data.length != 0) {
    let str ='';

  str += '<h3>Mã đơn hàng: ' + data._id +'</h3>';

  const customer = await M_Customer.find({
    _id: new mongoose.Types.ObjectId(idCustomer)
  }).exec();
  // Thông tin khách hàng

  str += '<h3>Thông Tin Khách Hàng:';

  str +='<ul>';
    str +='<li> Họ và Tên: '+ customer[0].name +'</li>';
    str +='<li> Email: '+ customer[0].email +'</li>';
    str +='<li> Số Điện Thoại: '+ customer[0].phone +'</li>';
    str +='<li> Đơn hàng: '+ detail +'</li>';
    str +='<li> Tổng tiền: '+ sumTotal+ '</li>';
  str +='</ul>';

  var mailOptions = {
    from: 'thieuhoangviet63@gmail.com',
    to: customer[0].email + ',thieuhoangviet63@gmail.com' ,
    subject: 'Đơn hàng từ website',
    html: str
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
  

  res.send({
    message: 'Success',
    code : 200,
    data
 })
})

router.post('/edit', function (req, res) {
    res.send('POST request to the homepage')
})

router.post('/delete', async (req, res) => {
  const data = await M_Order.deleteMany()
    res.send('Đã xóa hết đơn hàng')
})

module.exports = router