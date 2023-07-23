const express = require('express')
const router = express.Router()

// Gọi các router
router.use('/admin/dashboard', require('../router/R_Dashboard'))
router.use('/admin/category', require('../router/R_Category'))
router.use('/admin/product', require('../router/R_Product'))
router.use('/admin/user', require('../router/R_User'))

// login
router.get('/login', (req, res) => { res.render('admin/login') })

// Gọi API
router.use('/api/category', require('../apis/A_Category'))
router.use('/api/product', require('../apis/A_Product'))
router.use('/api/user', require('../apis/A_User'))
router.use('/api/deliveryMethod', require('../apis/A_Delivery_Method'))
router.use('/api/paymentMethod', require('../apis/A_Payment_Method'))
router.use('/api/customer', require('../apis/A_Customer'))
router.use('/api/order', require('../apis/A_Order'))
module.exports = router