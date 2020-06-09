import Vue from 'vue'
import Axios from 'axios'

Axios.interceptors.response.use((res)=>{
    return res.data;
})

Axios.defaults.timeout = 5000
Axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';

Vue.prototype.rquest_login = (data)=>{
    return Axios.post('login', data)
}