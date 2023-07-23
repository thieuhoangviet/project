const C_Admin = require('./C_Admin')

class Layout extends C_Admin{
    constructor(
        _url='',
        _name='', 
        _id='', 
        _class='', 
        _required='', 
        _event=''
    )
    {
        super(_url);
        this._name = _name;
        this._id = _id;
        this._class = _class;
        this._required = _required;
        this._event = _event
    }

    i_type(type){
        return 'type="'+type+'"';
    }

    i_name(){
        return 'name="'+this._name+'"';
    }

    i_value(value){
        return 'value="'+value+'"';
    }

    i_class(){
        return 'class="'+this._class+' form-control"';
    }

    i_id(){
        return 'id="'+this._id+'"';
    }

    i_row(rows=3){
        return 'rows="'+rows+'"';
    }
    
    input(_type='text', _value='')
    {
        var str='';

        str += `<input 

            `+this.i_type(_type)+` 
            
            `+this.i_name()+`
            
            `+this.i_value(_value)+`
            
            `+this.i_class()+`
            
            `+this.i_id()+`>`;
            
        return str;
    }
    
    select(_array=[], _dequy=false)
    {
        var str='';

        str += `<select 

            `+this.i_name()+`

            `+this.i_class()+`

            `+this.i_id()+`>`;

            str += '<option value="">--Chọn--</option>';

            if(_dequy == true){
                str += this.dequyOption(_array);
            }
            else{
                _array.forEach(e=>{
                    str += '<option value="'+e.id+'">'+e.name+'</option>';
                })
            }

        str += '</select>';

        return str;
    }
    
    textarea(_rows=3)
    {
        var str='';

        str += `<textarea 

            `+this.i_row()+`

            `+this.i_name()+`

            `+this.i_class()+`

            `+this.i_id()+`>
        
        </textarea>`;

        return str;
    }

    main(array=[], type='table', cardHeader, keySearch){
        var str='';
        str += '<section class="pcoded-main-container">';
            str += '<div class="pcoded-content">';
                str += this.breadcrumbs();
                str += '<div class="row">';
                    str += '<div class="col-sm-12">';
                        str += '<div class="card">';
                            str += this.cardHeader(cardHeader, keySearch);
                            str += '<div class="card-body">';
                                str += (type == 'form') 
                                ? this.form(array) : this.table(array);
                            str += '</div>';
                        str += '</div>';
                    str += '</div>'; 
                str += '</div>';
            str += '</div>';
        str += '</section>';
        return str;
    }

    breadcrumbs(){
        var str='';

        str +=`<div class="page-header">
            <div class="page-block">
                <div class="row align-items-center">
                    <div class="col-md-12">
                        <div class="page-header-title">
                            <h5 class="m-b-10">Form Validation</h5>
                        </div>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html"><i class="feather icon-home"></i></a></li>
                            <li class="breadcrumb-item"><a href="#!">Form Components</a></li>
                            <li class="breadcrumb-item"><a href="#!">Form Validation</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;

        return str;
    }

    cardHeader(type='add', keySearch){
        var str='';
        str += '<div class="card-header">';
        str += (type=='add') ? this.cardHeaderAdd(keySearch) : this.cardHeaderEdit();
        str += '</div>';
        return str;
    }

    cardHeaderAdd(keySearch=''){
        var str = '';
        str += '<div class="row">';
            str += '<div class="col-md-6">';
                str += `<a href="/admin/`+this.getNameModuleURL()+`/form"
                 class="btn btn-outline-primary has-ripple">
                 <i class="feather icon-plus"></i> Thêm </a>&nbsp;`;
                 str += `<button class="btn btn-outline-danger has-ripple"
                 data-bs-toggle="modal" data-bs-target="#trashCan">
                 <i class="feather icon-trash"></i> Thùng Rác</button>`;
            str += '</div>';
            str += '<div class="col-md-6">';
                str += `<form action=""><div class="input-group">
                    <input type="text" class="form-control" name="key" value="`+keySearch+`" placeholder="Nhập Từ Khóa...">
                    <button type="submit" class="input-group-text">
                        <i class="feather icon-search"></i> Tìm Kiếm
                    </button>
                </div></form>`;
            str += '</div>';
        str += '</div>';
        return str;
    }

    cardHeaderEdit(){
        return '<h5><i class="feather icon-plus"></i> Thêm '+this.setNameModule()+'</h5>';
    }

    table(array){
        var str='';
        str += '<div class="table-responsive">';
            str += '<table class="table table-striped">';
                str += this.thead(array);
                str += this.tbody(array);
            str += '</table>';
        str += '</div>';
        return str;
    }

    thead(array){
        var str = '';
        str += '<thead>';
            str += '<tr class="text-center">';
                str += '<th>#</th>';
                str += '<th>Ảnh</th>';
                var object = array.data[0];
                for (const key in object) {
                    if(key != 'id' && key!='parentsID' && key!='arrange'){
                        var width = '';
                        if(key == 'status'){
                            width = '10%';
                        }else if(key == 'parents'){
                            width = '20%';
                        }
                        str += '<th width="'+width+'">'+this.changeName(key)+'</th>';
                    }
                }
                str += '<th width="10%"><i class="feather icon-settings"></i></th>';
            str += '</tr>';
        str += '</thead>';
        return str;
    }

    tbody(array){
        var str='';
        str += '<tbody>';
            str += this.tbodyForeach(array);
        str += '</tbody>';
        return str;
    }

    tbodyForeach(array){
        var str='';

        if(array.dequy == true){
            str += this.trDequy(array.data);
        }
        else{
            array.data.forEach((e,i)=>{
                str += '<tr id="id-'+e.id+'">';

                    str += (array.sort == false) 
                    ? '<td class="text-center">'+(i+1)+'</td>'
                    : '<td class="text-center"><input type="text"></td>';
                    str +='<td class = "text-center">';
                    str += `<button type="button" class="btn btn-outline-info btn-sm has-ripple"data-bs-toggle="modal" data-bs-target="#ImgPopup" onclick="getClassId('`+e.id+`')">`;
                    str += '<i class="feather icon-plus"></i> thêm ảnh</button>';
                    for (const key in e) {
                        if(key!='id'){
                            str += (key=='status') 
                            ? '<td class="text-center"><input type="checkbox"></td>' 
                            : '<td>'+e[key]+'</td>';
                        }
                    }

                    str += '<td class="text-center">';
                    str += '<button type="button" class="btn btn-outline-info btn-sm has-ripple">';
                    str += '<i class="feather icon-edit"></i> Sửa </button>&nbsp;';
                    str += `<button type="button" class="btn btn-outline-danger btn-sm has-ripple"
                     data-bs-toggle="modal" data-bs-target="#deletePopup" onclick="getID('`+e.id+`')">`;
                    str += '<i class="feather icon-delete"></i> Xóa </button>';
                    str += '</td>';
                str += '</tr>';
            })
        }        

        return str;
    }

    trDequy(array=[], char='', id=''){
        var str='';
        
        array.forEach((e,i)=>{
            if(e.parentsID == id){ // cha
                str += '<tr id="id-'+e.id+'">';
                    str += (array.sort == false) 
                    ? '<td class="text-center">'+(i+1)+'</td>'
                    : `<td>`+char+`<input type="text" class="text-center" size="7" value="`+e.arrange+`"></td>`;
                    for (const key in e) {
                        if(key!='id' && key!='parentsID'){
                            if(key=='status'){
                                str += '<td class="text-center"><input type="checkbox"></td>';
                            }
                            else{
                                if(key!='arrange'){
                                    str += (key=='name') 
                                    ? '<td>'+char+e[key]+'</td>'
                                    : '<td class="text-center">'+e[key]+'</td>';
                                }
                            }
                        }
                    }
                    str += '<td class="text-center">';
                    str += '<button type="button" class="btn btn-outline-info btn-sm has-ripple">';
                    str += '<i class="feather icon-edit"></i> Sửa </button>&nbsp;';
                    str += `<button type="button" class="btn btn-outline-danger btn-sm has-ripple"
                    data-bs-toggle="modal" data-bs-target="#delete" onclick="getID('`+e.id+`')">`;
                    str += '<i class="feather icon-delete"></i> Xóa </button>';
                    str += '</td>';
                str += '</tr>';

                // con
                str += this.trDequy(array, char + '|----- ', e.id);
            } 
        })

        return str;
    }

    form(array){
        var str='';

        str += '<form id="getForm">';
            str += '<div class="row">';
                str += this.formForeach(array);
                str += '<div class="col-md-12">';
                    str += '<button type="submit" class="btn btn-primary">Lưu</button>&nbsp;';
                    str += '<a href="/admin/'+this.getNameModuleURL()+'/index" class="btn btn-dark">Thoát</a>';
                str += '</div>';
            str += '</div>';
        str += '</div>';

        return str;
    }

    formForeach(array){
        var str='';

        array.forEach(e=>{
            this._id = e.id;
            str += '<div class="col-md-6">'; 
                str += '<div class="form-group">';
                    str += '<label class="form-label">'+this.changeName(e.name)+'</label>';
                    if(e.element == 'input'){
                        str += this.input(e.type);
                    }
                    else if(e.element == 'select'){
                        str += this.select(e.array, e.dequy);
                    }
                str += '</div>';
            str += '</div>';
        })

        return str;
    }

    dequyOption(array=[], char='', id='')
    {
        var str='';

        array.forEach(e => {
            if(e.parentsID == id){ // cha
                str += '<option value="' + e.id + '">' + char + e.name + '</option>';

                // con
                str += this.dequyOption(array, char + '|----- ', e.id);
            }
        });

        return str;
    }
}

module.exports = Layout