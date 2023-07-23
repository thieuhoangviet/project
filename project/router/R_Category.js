const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
// Gọi controllers
const C_Category = require('../controllers/C_Category')
const use_C_Category = new C_Category()

// Gọi Models
const M_Category = require('../models/M_Category')
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/index', 

(req, res, next) => {
    if(req.cookies.name == undefined) res.redirect('/login')
    next()
},

async (req, res) => {
    const use_C_Class = new C_Category(req.originalUrl)

    const list = await M_Category.find()

    const fullList = {}
    const newList = []

    list.forEach(e=>{
        const d = new Date(e.date_created);
        const date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()

        newList.push({
            id: e._id.toString(),
            parentsID: (e.parentsID==null) ? '' : e.parentsID.toString(),
            name: e.name,
            date_created: date,
            status: e.status,
            arrange: e.arrange
        })
    })

    fullList['data'] = newList
    fullList['sort'] = true;
    fullList['dequy'] = true;

    const main = use_C_Class.mainCategory(fullList)

    var path = 'main';
    res.render('admin/index', {
        path, 
        main,
        nameModule: use_C_Class.getNameModuleURL()
    })
})

// form
router.get('/form', async (req, res) => {
    const use_C_Class = new C_Category(req.originalUrl)

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
        {
            element: 'input', type: 'text', 
            name: 'name', id: 'name', class: 'name'
        },
        {
            element: 'select', type: '', 
            name: 'parentsID', id: 'parentsID', class: 'parentsID',
            array: newList, dequy: true
        },
    ];

    const main = use_C_Class.mainCategory(Attribute, 'form', 'edit')

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
    slug = use_C_Category.ChangeToSlug(name)
    parentsID = req.body.parentsID

    if(name!=''){
        data['name'] = name
        data['slug'] = slug
    }

    if(parentsID!='') data['parentsID'] = parentsID

    if(flag == 1){

        const nameCheck = await M_Category.find({ $or:[ {name}, {slug} ] }).select('_id')

        if(nameCheck == '')
        {
            // lấy ra giá trị của arrange
            const arrangeList = await M_Category.find(
                    {parentsID: (parentsID=='') ? null : parentsID}
                )
                .select(['arrange'])
                .sort({_id: -1})
                .limit(1)
            
            var arrange = (arrangeList!='') ? arrangeList[0].arrange + 1 : 1

            data['arrange'] = arrange
            data['userID'] = req.cookies.name

            await M_Category
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

router.get('/deleteAll', async (req, res) => {
    M_Category.remove({}, (err)=>{
        if(err){    
            res.send({kq:0, msg: 'Lỗi DB'})
        }
        else{
            res.send({kq:1, msg: 'Đã xóa'})
        }
    });
})

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
        var checkID = await M_Category.find({_id: id})

        if(checkID != ''){
            await M_Category.deleteMany({_id: id})
            res.send({data: 'Đã xóa!', msg: 200})
        }else{
            error = 'Dữ liệu không tồn tại!'
            flag = 0
            res.send({error, msg: 500})
        }
    }
    else{
        res.send({error, msg: 500})
    }
})


module.exports = router