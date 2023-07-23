const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose');


// Gọi controllers
const C_Admin = require('../controllers/C_Admin')
const use_C_Admin = new C_Admin()

// Gọi Models
const M_Category = require('../models/M_Category');
const M_Product = require('../models/M_Product');

const ObjectId = mongoose.Types.ObjectId;
// getlist
router.get('/getlist', async (req, res) => {
   const data = await M_Category
   .find({},{
      name:1, 
      slug:1, 
      status:1, 
      parentsID:1
   })
   .exec();

   res.send({
      message:'Success',
      code: 200, 
      data
   })
})

// getlistParent and Childs
router.get('/getlistParent', async (req, res) => {
   const data = await M_Category.aggregate([
      {$match:{parentsID:null}},
      {
         $project: { // same select
            _id : 1,
            name : 1,
            slug : 1,
            status : 1,
            parentsID : 1
         }
      },
      {
         $lookup: {
            from: 'categories',
            localField : '_id',
            foreignField : 'parentsID',
            pipeline: [
               {
                  $project: { // same select
                     _id : 1,
                     name : 1,
                     slug : 1,
                     status : 1,
                     parentsID : 1
                  }
               }
            ],
            as: 'childs'
         }
      }
   ]).exec()

   res.send({
      message:'Success',
      code: 200, 
      data
   })
})


// getDetail
router.get('/getDetail/:id', async (req, res) => {
   
   if (ObjectId.isValid(req.params.id)==false){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không tồn tại.'
      })
      return
   }
   if(req.params.id == undefined){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không tồn tại.'
      })
      return
   }

      const data = await M_Category
      .find({_id:mongoose.Types.ObjectId(req.params.id)},{name:1})
      .exec();

      res.send({
         message: 'Success',
         code : 200,
         data
      })
      results = {msg: 200, data};
   })

//create
router.post('/create', async (req, res)=> {
  const name = req.body.name;

  if(name == undefined|| name.trim()==''){
   res.send({
   message: 'Success',
   code : 403,
   error: 'Tên không được rỗng'
})
      return 
}

  const slug = use_C_Admin.ChangeToSlug(name)
  const parentsID = req.body.parentsID == undefined ||req.body.parentsID.trim() == '' ? null : req.body.parentsID;
  
  if(parentsID != null){
   if(ObjectId.isValid(parentsID)==false){
      res.send({
      message: 'Success',
      code : 403,
      error: 'parentsID không hợp lệ'
   })
         return 
   } 
  }
  

   const data = await M_Category.create({name, slug, parentsID})
  res.send({
   message: 'Success',
   code : 200,
   data
})
})

//update
router.put('/update/:id', async (req, res)=> {
   const name = req.body.name;
 
 const ObjectUpdate ={}
 let slug ='';

   if(name != undefined){
      if( name.trim()==''){
         res.send({
         message: 'Success',
         code : 403,
         error: 'Tên không được rỗng'
      })
            return 
      }else{
         ObjectUpdate['name']= name
         ObjectUpdate['slug']= use_C_Admin.ChangeToSlug(name)
      }
   }

   
   const parentsID = req.body.parentsID;
   
   if(parentsID != undefined){
      if(ObjectId.isValid(parentsID)==false){
         res.send({
         message: 'Success',
         code : 403,
         error: 'parentsID không hợp lệ'
        })
            return 
        }else{
         ObjectUpdate['parentsID']= parentsID
        }
   }

   
   if (ObjectId.isValid(req.params.id)==false){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không tồn tại.'
      })
      return
   }

   const checkID = await M_Category.find({_id: mongoose.Types.ObjectId(req.params.id)}).exec()

   if(checkID==''){
      res.send({
      message: 'Success',
      code : 403,
      error: 'Dữ liệu không tồn tại.'
   })
      return
   }



   await M_Category.findByIdAndUpdate({
      _id:mongoose.Types.ObjectId(req.params.id)},
   ObjectUpdate)

   const data = await M_Category.find({
      _id:mongoose.Types.ObjectId(req.params.id)})
   res.send({
      message: 'Success',
         code : 200,
         data : {
            results: 'Đã update ',
            field: data
         }
   })

})

//Delete
router.delete('/delete/:id', async (req, res) =>{
   
   if (ObjectId.isValid(req.params.id)==false){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không tồn tại.'
      })
      return
   }

   const checkID = await M_Category.find(
      {_id: mongoose.Types.ObjectId(req.params.id)}).exec()

   if(checkID==''){
      res.send({
      message: 'Success',
      code : 403,
      error: 'Dữ liệu không tồn tại.'
   })
      return
   }

   const data = await M_Category
   .findByIdAndDelete({_id: mongoose.Types.ObjectId(req.params.id)})
   .exec();

   res.send({
      message: 'Success',
         code : 200,
         data : {
            results: 'Đã xóa ',
            field: data
         }
   })
})
router.get('/breadcrumb/:id', async (req, res) => {
  
   if (ObjectId.isValid(req.params.id)==false){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không tồn tại.'
      })
      return
   }

   const checkID = await M_Category.find(
      {_id: mongoose.Types.ObjectId(req.params.id)}).exec()

   if(checkID==''){
      res.send({
      message: 'Success',
      code : 403,
      error: 'Dữ liệu không tồn tại.'
   })
      return
   }

   // Lấy dữ liệu của id
  const data = await M_Category.find(
   {_id : mongoose.Types.ObjectId(req.params.id)}
   ).exec();

   const newData ={}

   newData ['_id'] = data[0]._id,
   newData ['name'] = data[0].name

   if(data[0].parentsID != null){
      const dataFatherOne = await M_Category.find(
         {_id : mongoose.Types.ObjectId(data[0].parentsID)}
      ).exec();
      newData ['fatherOne'] = {
         _id: dataFatherOne[0]._id,
         name: dataFatherOne[0].name
      }
   }
   res.send({
      message: 'Success',
         code : 200,
         data : newData
   })
})

router.get('/getListProduct/:id', async (req, res) => {
  var _id = req.params.id;

  if (ObjectId.isValid(_id)==false){
   res.send({
      message: 'Success',
      code : 403,
      error: 'Dữ liệu không đúng.'
   })
   return
   }
   //check DB
   const checkID = await M_Category.find({_id}).exec();
   if(checkID.length == 0){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không đúng.'
      })
      return
   }
   const data = await M_Product.find(
      {parentsID: mongoose.Types.ObjectId(_id)})
      .select(['_id','name','price','avatar'])
      .exec();

   res.send({
      message: 'Success',
         code : 200,
         data
   })
})
module.exports = router