import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getRightsList = (method)=>{
    return Axios.get('rights/' + method)
}