import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getParamList = (data) => {
    return Axios.get(`categories/${data.cat_id}/attributes`, {
        params: {
            sel: data.type
        }
    })
}

Vue.prototype.rquest_addParams = (data) => {
    return Axios.post(`categories/${data.cat_id}/attributes`, data)
}

Vue.prototype.rquest_deleteParams = (data) => {
    return Axios.delete(`categories/${data.cat_id}/attributes/${data.attr_id}`)
}

Vue.prototype.rquest_getParams = (data) => {
    return Axios.get(`categories/${data.cat_id}/attributes/${data.attr_id}`,{
        params:data
    })
}

Vue.prototype.rquest_editParams = (data) => {
    return Axios.put(`categories/${data.cat_id}/attributes/${data.attr_id}`, data)
}