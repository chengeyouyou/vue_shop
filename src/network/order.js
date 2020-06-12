import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getOrderList = (data)=>{
    return Axios.get('orders', {
        params:data
    })
}


Vue.prototype.rquest_getWuLiu = ()=>{
    return Axios.get('/kuaidi/1106975712662')
}
