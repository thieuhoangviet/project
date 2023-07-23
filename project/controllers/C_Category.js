const C_Layout = require('./C_Layout')

class Category extends C_Layout{
    tableCategory(){

    }
    mainCategory(array=[], type, cardHeader){
        return this.main(array, type, cardHeader);
    }
    formCategory(){

    }
}

module.exports = Category