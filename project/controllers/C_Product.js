const C_Layout = require('./C_Layout')

class Product extends C_Layout{
    tableProduct(){

    }
    mainProduct(array=[], keySearch, type, cardHeader){
        return this.main(array, type, cardHeader, keySearch);
    }
    formProduct(){

    }
}

module.exports = Product