const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// Gọi controllers
const C_User = require('../controllers/C_User')
const use_C_User = new C_User()

// Gọi Models
const M_User = require('../models/M_User')

router.get('/index', 

(req, res, next) => {
    if(req.cookies.name == undefined) res.redirect('/login')
    next()
},

async (req, res) => {
    const use_C_Class = new C_User(req.originalUrl)

    const list = await M_User.find().sort({_id: -1})

    const fullList = {}
    const newList = []

    list.forEach(e=>{
        newList.push({
            id: e._id,
            email: e.email,
            status: e.status
        })
    })

    fullList['data'] = newList
    fullList['sort'] = false;
    fullList['dequy'] = false;

    const main = use_C_Class.mainUser(fullList)

    var path = 'main';
    res.render('admin/index', {
        path, 
        main,
        nameModule: use_C_Class.getNameModuleURL()
    })
})

// form
router.get('/form', (req, res) => {
    const use_C_Class = new C_User(req.originalUrl)

    const array = [
        { id: 'admin', name: 'Admin' },
        { id: 'user', name: 'User' },
        { id: 'guest', name: 'Guest' },
    ]

    // form
    const Attribute = [
        {
            element: 'input', type: 'email', 
            name: 'email', id: 'email', class: 'email'
        },
        {
            element: 'input', type: 'tel', 
            name: 'phone', id: 'phone', class: 'phone'
        },
        {
            element: 'input', type: 'password', 
            name: 'password', id: 'password', class: 'password'
        },
        {
            element: 'select', type: '', 
            name: 'role', id: 'role', class: 'role',
            array, dequy: false
        },
    ];

    const main = use_C_Class.mainUser(Attribute, 'form', 'edit')

    var path = 'main';
    res.render('admin/index', {
        path, 
        main,
        nameModule: use_C_Class.getNameModuleURL()
    })
})

// insert
router.post('/insert', async function (req, res) {
    var email = phone = password = role = ''
    var data = {}
    var flag=1

    email = req.body.email
    phone = req.body.phone
    password = req.body.password
    role = req.body.role

    // kiểm tra dữ liệu

    // data['email'] = email
    // data['phone'] = phone
    // data['password'] = password

    if(flag == 1){
        // check email có tồn tại trong db ko?
        const emailPhoneCheck = await M_User.find(
            { 
                $or:[ 
                    {email}, 
                    {phone}
                ]
            }
        )

        if(emailPhoneCheck == ''){
            const hash = bcrypt.hashSync(password, salt);

            const insertObject = { email, phone, password: hash, role }
            // console.log(insertObject)
            // console.log(insertObject);
            // return
            // thêm
            await M_User.create(insertObject, (err)=>{
                if(err){
                    res.send({kq:0, msg: 'Kết nối DB thất bại'})
                }
                else{
                    res.send({kq:1, msg: 'Đã thêm thành công'})
                }
            })
        }
        else{
            res.send({kq:0, err: '500', msg: 'Email hoặc Số Điện Thoại đã tồn tại'})
        }
    }
})

router.post('/processLogin', async (req, res) => {
    var email=password=''
    var flag=1
    var error=[]

    email = req.body.email
    password = req.body.password

    if(email == ''){
        flag=0
        error.push('Vui lòng nhập Tên Đăng Nhập') 
    }

    if(password == ''){
        flag=0
        error.push('Vui lòng nhập Mật Khẩu') 
    }

    if(flag==1){
        const emailCheck = await M_User.find({email})

        if(emailCheck==''){
            res.send({kq:0, msg: 'Thất bại! Vui lòng kiểm tra lại.'})
        }
        else{
            const passwordCheck = bcrypt.compareSync(password, emailCheck[0].password);

            if(passwordCheck){
                res.cookie('name', emailCheck[0]._id, {maxAge: 60 * 60000})
                .send({kq:1, msg: 'Đăng Nhập Thành Công.'})
            }
            else{
                res.send({kq:0, msg: 'Thất bại! Vui lòng kiểm tra lại.'})
            }
        }
    }
    else{
        res.send({kq:0, msg: error})
    }
})

router.get('/delete', (req, res) => {
    M_User.remove((err)=>{
        res.send('Đã xóa')
    })
})

module.exports = router