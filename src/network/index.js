import Axios from 'axios'
//axios的配置
Axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('TOKEN');
    return config;
});

Axios.interceptors.response.use(res=>{
    return res.data;
})

Axios.defaults.timeout = 5000
Axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';

import './user.js';
import './rights.js';
import './role.js';
import './goods_cate.js';
import './goods_params.js';
