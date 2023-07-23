const express = require('express')
const router = express.Router()
const { default: mongoose } = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
// Gọi Models
const M_Product = require('../models/M_Product')
const M_Category = require('../models/M_Category')

// Gọi controllers
const C_Admin = require('../controllers/C_Admin')
const use_C_Admin = new C_Admin()

// getlist
router.get('/getlist', async (req, res) => {
  const data = await M_Product
   .find({},{
      name:1, 
      slug:1, 
      status:1, 
      parentsID:1,
      price: 1
   })
   .exec();

   res.send({
      message:'Success',
      code: 200, 
      data
   })
})

router.get('/getDetail/:id', async (req, res) => {
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
   const checkID = await M_Product.find({_id}).exec();
   if(checkID.length == 0){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không đúng.'
      })
      return
   }
   const data = await M_Product.find(
    {_id: mongoose.Types.ObjectId(_id)}
    )
    .select(['_id','name','price','content','parentsID','avatar'])
    .exec();

    res.send({
      message: 'Success',
       code : 200,
       data : data[0]
  })
})
router.post('/create', async (req, res)=> {   
  const object = {}
  
   const name = req.body.name;

  if(name == undefined|| name.trim()==''){
   res.send({
   message: 'Success',
   code : 403,
   error: 'Tên không được rỗng'
})
      return 
}

  // check name

  const checkName = await M_Product.find(
    {name: {'$regex':'^'+name+'$','$options':'i'}})
    .exec()
  if(checkName.length>0){
    res.send({
      message: 'Success',
      code : 403,
      error: 'Dữ liệu không đúng'
   })
   return
  }


  const slug = use_C_Admin.ChangeToSlug(name)

  object.name = name
  object.slug = slug

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

  object.parentsID = parentsID
  
  const price = req.body.price;
  object.price = (price != undefined) ? price :0

  const content = req.body.content;
  if(content != undefined) object.content = content

   const data = await M_Product.create(object)
   
   res.send({
   message: 'Success',
   code : 200,
   data
   })
})

router.post('/update/:id', async (req, res) => {
   //Check ID

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
   const checkID = await M_Product.find(
      {_id: mongoose.Types.ObjectId(_id)}
      ).exec();

   if(checkID.length == 0){
      res.send({
         message: 'Success',
         code : 403,
         error: 'Dữ liệu không đúng.'
      })
      return
   }
    

   const object = {}
  
   const name = req.body.name;

  if(name != undefined ){
   if (name.trim()=='') {
      res.send({
         message: 'Success',
         code : 403,
         error: 'Tên không được rỗng'
         })
            return 
      }
      else{
         // check name
         const checkName = await M_Product
            .find({name, _id : {$ne: mongoose.Types.ObjectId(_id) }})
            .select('_id')
            .exec()
         
            if(checkName.length != 0){
            res.send({
            message: 'Success',
            code : 403,
            error: 'Dữ liệu không đúng'
         })
         return
         }
         object.name = name
         const slug = use_C_Admin.ChangeToSlug(name)
         object.slug = slug
      }
   }




  const parentsID = req.body.parentsID == undefined ||req.body.parentsID.trim() == '' ? null : req.body.parentsID;
  
  if(parentsID != undefined){
   if(ObjectId.isValid(parentsID)==false){
      res.send({
      message: 'Success',
      code : 403,
      error: 'parentsID không hợp lệ'
   })
         return 
   }
   else{
      object.parentsID = parentsID
   }
  }
  

  const price = req.body.price;
  if(price != undefined) object.price = price

  const content = req.body.content;
  if(content != undefined) object.content = content
   await M_Product.findByIdAndUpdate({
      _id: mongoose.Types.ObjectId(_id)
      },object)
   
   const data =  await M_Product.find({
      _id: mongoose.Types.ObjectId(_id)
   }).exec();

   res.send({
   message: 'Success',
   code : 200,
   data
   })
})

// Sản phẩm liên quan
router.get('/relative/:categoryId/:productId', async (req, res) => {
   var categoryId = req.params.categoryId;
 
   if(ObjectId.isValid(categoryId) == false){
     res.send({
       message: 'Success',
       code: 403,
       error: 'Dữ liệu không đúng'
     })
     return
   }
 
   // check DB
   const checkCategoryId = await M_Category.find({
     _id: mongoose.Types.ObjectId(categoryId)
   }).exec();
   if(checkCategoryId.length == 0){
     res.send({
       message: 'Success',
       code: 403,
       error: 'Dữ liệu không đúng'
     })
     return
   }
 
   var productId = req.params.productId;
 
   if(ObjectId.isValid(productId) == false){
     res.send({
       message: 'Success',
       code: 403,
       error: 'Dữ liệu không đúng'
     })
     return
   }
 
   // check DB
   const checkProductId = await M_Product.find({
     _id: mongoose.Types.ObjectId(productId)
   }).exec();
   if(checkProductId.length == 0){
     res.send({
       message: 'Success',
       code: 403,
       error: 'Dữ liệu không đúng'
     })
     return
   }
 
   console.log(
     categoryId + '/' + productId
   );
 
   const data = await M_Product.find({
     parentsID: mongoose.Types.ObjectId(categoryId),
     _id: { $ne: mongoose.Types.ObjectId(productId) }
   }).limit(5).exec();
 
   res.send({
     message: 'Success',
     code: 200,
     data
   })
 })


// tìm kiếm sản phẩm
router.get('/search/:key', async (req, res) => {
   const key = req.params.key;

   const data = await M_Product.find({ name: { $regex: key } }).exec();

   res.send({data})
})
module.exports = router