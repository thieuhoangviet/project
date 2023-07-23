const express = require('express')
const app = express()
const port = 3000

// Cấu hình đường dẫn tĩnh để sử dụng các file css, js, img trong folder public
app.use(express.static('public'))


// Mở port cho angular có thể truy xuất dữ liệu
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Lấy dữ liệu
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cookie
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set('view engine', 'ejs')

// Gọi controls
app.use('/', require('./configs/Controls'))

// Gọi Database
require('./configs/Database')

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 