const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
// Gọi Models
const M_Customer = require('../models/M_Customer');


router.post('/add', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const note = req.body.note;

  const object = {}


  object['email']= email;
  object['phone']= phone;

  if(address != undefined) object['address'] = address
  if(note != undefined) object['note'] = note
  if(name != undefined) object['name'] = name

  const check = await M_Customer.find({
    $or: [ { email }, { phone } ]
  }).select('_id').limit(1).exec();

  if(check.length > 0){
      res.send({
        message: 'Success',
        code: 200,
        data: check[0]._id
    })
    return
  }


  const data =await M_Customer.create(object)

  res.send({
      message: 'Success',
      code : 200,
      data: data._id
   })

})

router.post('/edit', function (req, res) {
    res.send('POST request to the homepage')
})

router.post('/delete', function (req, res) {
    res.send('POST request to the homepage')
})

module.exports = router