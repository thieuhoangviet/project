class Admin{
    constructor(_url=''){
        this._url = _url
    }

    changeName(key=''){
        var str='';

        switch (key) {
            case 'email': str += 'Email'; break;
            case 'name': str += 'Tên'; break;
            case 'parentsID': str += 'Cha'; break;
            case 'phone': str += 'Số Điện Thoại'; break;
            case 'password': str += 'Mật Khẩu'; break;
            case 'user': str += 'Thành Viên'; break;
            case 'category': str += 'Danh Mục'; break;
            case 'product': str += 'Sản Phẩm'; break;
            case 'date_created': str += 'Ngày tạo'; break;
            case 'status': str += 'Trạng Thái'; break;
            case 'role': str += 'Vai Trò'; break;
            case 'parents': str += 'Danh Mục Cha'; break;
        
            default: str += 'Chưa đặt tên'; break;
        }

        return str;
    }

    getNameModuleURL(){
        return this._url.split('/')[2];
    }

    setNameModule(){
        return this.changeName(this.getNameModuleURL());
    }

    ChangeToSlug(title)
    {
        var slug;
    
        //Đổi chữ hoa thành chữ thường
        slug = title.toLowerCase();
    
        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        //In slug ra textbox có id “slug”
        return slug;
    }
}

module.exports = Admin