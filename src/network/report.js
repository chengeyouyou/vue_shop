import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getReport = ()=>{
    return Axios.get('reports/type/1')
}
