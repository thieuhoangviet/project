const express = require('express')
const router = express.Router()

router.get('/index', 

(req, res, next) => {
    if(req.cookies.name == undefined) res.redirect('/login')
    next()
},

(req, res) => {

    var path = 'dashboard/main'
    res.render('admin/index', {
        path,
        nameModule: ''
    })
})

module.exports = router