const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
// Gọi controllers
const C_Product = require('../controllers/C_Product')
const use_C_Product = new C_Product()

// Gọi Models
const M_Product = require('../models/M_Product')
const M_Category = require('../models/M_Category')

const multer = require('multer')
//const upload = multer({ dest: 'uploads/' })

// storage
const storage = multer.diskStorage({
  // đường dẫn lưu file
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/product')
  },
  // thông tin file
  filename: function (req, file, cb) {
    // console.log(file)
    // 1. kiểm tra tên file

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    //console.log(uniqueSuffix)

    // 2. kiểm tra đuôi file
    
    cb(null, file.originalname)
  }
})
const limits = { fileSize: 500000 } // 1KB = 1024B

const upload = multer({ storage, limits }).single('file')

router.post('/uploadFile/:id', (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.send({ kq: 0, msg: err })
      }
      else if (err) {
        res.send({ kq: 0, msg: err })
      }
      else if(err == undefined){
        const check_NameFile = req.hasOwnProperty('file');
  
        if( check_NameFile == true ){
            // xoa anh cu
            
            // 1. ten anh
            // 2. id
            const id = req.params.id
            const name = req.file.originalname
            await M_Product.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(id)}, {avatar: name}).exec();
            // const data = await M_Product.find({_id: new mongoose.Types.ObjectId(id)}).exec();
            // console.log(data);

          res.send({ kq: 1, msg: 'ok' })
        }
        else{
          res.send({ kq: 0, msg: 'Vui lòng chọn File.' })
        }
      }
    })
  })

router.get('/index', 

// (req, res, next) => {
//     if(req.cookies.name == undefined) res.redirect('/login')
//     next()
// },

async (req, res) => {
    const use_C_Class = new C_Product(req.originalUrl)

    var keySearch = req.query.key

    var match = {status: false}

    if(keySearch != undefined && keySearch != ''){
        match['name'] = { $regex: '.*' + keySearch + '.*' }
    }

    const list = await M_Product.aggregate([
        {
            $match: match
        },
        {
            $sort: {_id: -1}
        },
        {
            $lookup:
            {
                from: 'categories',
                localField: 'parentsID',
                foreignField: '_id',
                as: 'Product_vs_Category'
            }
        }
    ]).exec()

    const fullList = {}
    const newList = []

    list.forEach((e) => {
        newList.push({
            id: e._id,
            name: e.name,
            parents: e.Product_vs_Category[0].name,
            status: e.status
        })
    })

    fullList['data'] = newList
    fullList['sort'] = false;
    fullList['dequy'] = false;

    const main = use_C_Class.mainProduct(fullList, keySearch)

    var path = 'main';
    res.render('admin/index', {
        path, 
        main,
        keySearch,
        nameModule: use_C_Class.getNameModuleURL()
    })
})

// form
router.get('/form', async (req, res) => {
    const use_C_Class = new C_Product(req.originalUrl)
    
    // danh sách danh mục
    const list = await M_Category.find()

    const newList = []

    list.forEach(e=>{ newList.push({ 
        id: e._id.toString(), 
        name: e.name, 
        parentsID: (e.parentsID==null) ? '' : e.parentsID.toString()
    }) })

    // form
    const Attribute = [
        // email
        {
            element: 'input', type: 'text', 
            name: 'name', id: 'name', class: 'name'
        },
        // phone
        {
            element: 'select', type: '', 
            name: 'parentsID', id: 'parentsID', class: 'parentsID',
            array: newList, dequy: true
        }
    ];

    const main = use_C_Class.mainProduct(Attribute, '', 'form', 'edit')

    var path = 'main';
    res.render('admin/index', {
        path, 
        main,
        nameModule: use_C_Class.getNameModuleURL()
    })
})

router.post('/insert', async function (req, res) {
    var name = slug = parentsID = ''
    var data = {}
    var flag=1

    name = req.body.name
    slug = use_C_Product.ChangeToSlug(name)
    parentsID = req.body.parentsID

    if(name!=''){
        data['name'] = name
        data['slug'] = slug
    }

    if(parentsID!='') data['parentsID'] = parentsID

    if(flag == 1){

        const nameCheck = await M_Product.find({ $or:[ {name}, {slug} ] }).select('_id')

        if(nameCheck == '')
        {
            data['userID'] = req.cookies.name

            await M_Product
            .create(data, (err)=>{
                if(err){
                    res.send({kq:0, msg: 'Kết nối DB thất bại'})
                }
                else{
                    res.send({kq:1, msg: 'Đã thêm thành công'})
                }
            })
        }
        else
        {
            res.send({kq:0, err: '500', msg: 'Dữ liệu đã tồn tại'})
        }
    }
})

var ObjectId = require('mongoose').Types.ObjectId;

router.post('/delete', async (req, res) => {
    var id = req.body.id;

    var error = '';
    var flag = 1;

    if(id == ''){
        error = 'Vui lòng nhập ID';
        flag = 0;
    }

    if(ObjectId.isValid(id) == false){
        error = 'ID không hợp lệ';
        flag = 0;
    }

    if(flag == 1){
        // check db
        var checkID = await M_Product.find({_id: id})

        if(checkID != ''){
            await M_Product.deleteMany({_id: id})
            res.send({data: 'Đã xóa!', msg: 200})
        }else{
            error = 'Dữ liệu không tồn tại!'
            flag = 0
        }
    }
    else{
        res.send({error, msg: 500})
    }
})

module.exports = router