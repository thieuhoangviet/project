const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const secret = '#QEWQJ'
// Gọi Models
const M_User = require('../models/M_User')


// getlist
router.get('/getlist', (req, res) => {
  res.send('GET request to the homepage')
})
// getDetail
router.get('/getDetail/:token',async(req, res) => {
  if (req.params.token.trim() == '') {
    res.send({
      Message: 'Success',
      code: 200,
      data: { error: 'Dữ liệu không chính xác', code: 403 }
    })
    return
  }

  jwt.verify(req.params.token, secret, async (err, decoded) =>{
    //Gọi DB
    if (err) {
      res.send({
        Message: 'Success',
        code: 200,
        data: { error: 'Token hết hạn', code: 403 }
      })
      return
    }
      const data = await M_User.find({_id: decoded.data._id}).exec();

      res.send({
        message: 'Success',
          code : 200,
          data: {
           email : data[0].email
          }
    })
  });
})

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

function ValidatePhone(phone)
{
  if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phone))
  {
    return (true)
  }
    return (false)
}

function CheckEmpty(value) {
  if (value.trim() =='') {
    return false
  }
  return true
}

// Login
router.post('/login', async (req, res)=> {
  const email = req.body.email
  const password = req.body.password

  const checkEmptyEmail = CheckEmpty(email)
  const checkEmptyPassword = CheckEmpty(password)
  const validateEmail = ValidateEmail(email)

  const arrayCheck = []

  if(checkEmptyEmail == false) arrayCheck.push('Email không được rỗng')
  if(validateEmail == false) arrayCheck.push('Email không đúng định dạng')
  if(checkEmptyPassword == false) arrayCheck.push('Mật khẩu không được rỗng')

  if (arrayCheck.length == 0) {
    const checkEmailInDB = await M_User.find({email})
    .select()
    .limit(1)
    .exec()
    if (checkEmailInDB.length == 0){
      res.send({
        Message: 'Success',
        code: 200,
        data: { error: 'Dữ liệu không chính xác', code: 403 }
      })
      return
    }
    //bcryptjs
    const checkPassword = bcrypt.compareSync(password, checkEmailInDB[0].password);
    if (!checkPassword){
      res.send({
        Message: 'Success',
        code: 200,
        data: { error: 'Dữ liệu không chính xác', code: 403 }
      })
      return
    }
    //token
    const token = jwt.sign({
      data:{_id: checkEmailInDB[0]._id}
    }, secret, {expiresIn: 60 * 60});
    res.send({
      Message: 'Success',
      code: 200,
      data: { token }
    })
  }
  else res.send({
    Message: 'Success',
    code: 200,
    data: { error: arrayCheck, code: 403 }
  })
})

const salt = bcrypt.genSaltSync(10);

// register (Đăng ký)
router.post('/register', async (req, res) => {
  const fullname = req.body.fullname
  const email = req.body.email
  const password = req.body.password
  const phone = req.body.phone
  const address = req.body.address

  // kiểm tra dữ liệu

  const checkEmail = await M_User.find({email}).limit(1).select('_id').exec();
  if(checkEmail.length > 0){
    res.send({
      message: 'Success',
      code: 200,
      data: { error: 'Dữ liệu không chính xác.', code: 603 }
    })
    return;
  }

  const checkPhone = await M_User.find({phone}).limit(1).select('_id').exec();
  if(checkPhone.length > 0){
    res.send({
      message: 'Success',
      code: 200,
      data: { error: 'Dữ liệu không chính xác.', code: 603 }
    })
    return;
  }
    const data = await M_User.create({
      name : fullname,
      email,
      password : bcrypt.hashSync(password, salt),
      phone,
      address

    })
   res.send({
    message: 'Success',
    code : 200,
    data
 })
})
module.exports = router