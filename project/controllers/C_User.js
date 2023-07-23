const C_Layout = require('./C_Layout')

class User extends C_Layout{
    tableUser(array=[]){
    }

    mainUser(array=[], type, cardHeader){
        return this.main(array, type, cardHeader);
    }

    formUser(array=[]){
        
    }
}

module.exports = User