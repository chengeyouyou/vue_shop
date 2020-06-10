import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_login = (data)=>{
    return Axios.post('login', data)
}

Vue.prototype.rquest_getMenuList = ()=>{
    return Axios.get('menus')
}

//用户管理界面用到的接口
//请求用户
Vue.prototype.rquest_getUserList = (data)=>{
    return Axios.get('users',{
        params:data
    })
}

//修改用户状态
Vue.prototype.rquest_changeUserStatus = (data)=>{
    return Axios.put(`users/${data.uId}/state/${data.type}`)
}

//添加用户
Vue.prototype.rquest_addUser = (data)=>{
    return Axios.post("users",data);
}

//根据 ID 查询用户信息
Vue.prototype.rquest_getUser = (data)=>{
    return Axios.get("users/" + data.id);
}


//编辑用户提交
Vue.prototype.rquest_editUser = (data)=>{
    return Axios.put("users/" + data.id, data);
}

//删除用户提交
Vue.prototype.rquest_deleteUser = (data)=>{
    return Axios.delete("users/" + data.id);
}

//分配用户角色
Vue.prototype.rquest_assignRole = (data)=>{
    return Axios.put(`users/${data.id}/role`,{
        rid:data.rid
    });
}

