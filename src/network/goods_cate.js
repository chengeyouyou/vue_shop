import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getCateList = (data) => {
    return Axios.get('categories', {
        params: data
    })
}

Vue.prototype.rquest_addCate = (data) => {
    return Axios.post('categories', data);
}

Vue.prototype.rquest_deleteCate = (data) => {
    return Axios.delete('categories/'+ data.id);
}

Vue.prototype.rquest_getCate = (data) => {
    return Axios.get('categories/'+ data.id);
}

Vue.prototype.rquest_editCate = (data) => {
    return Axios.put('categories/'+ data.cat_id,{
        cat_name: data.cat_name
    });
}