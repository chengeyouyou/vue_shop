import Vue from 'vue';
import Axios from 'axios'

Vue.prototype.rquest_getRoleList = ()=>{
    return Axios.get('roles')
}

Vue.prototype.rquest_deleteRoleRights = (data)=>{
    return Axios.delete(`roles/${data.roleId}/rights/${data.rightId}`)
}

Vue.prototype.rquest_deleteRole = (data)=>{
    return Axios.delete(`roles/${data.roleId}`)
}

Vue.prototype.rquest_getAssignRights = (data)=>{
    return Axios.post(`roles/${data.roleId}/rights`,{
        rids:data.rids
    })
}

Vue.prototype.rquest_addRole = (data)=>{
    return Axios.post('roles',data)
}

Vue.prototype.rquest_editRole = (data)=>{
    return Axios.put('roles/' + data.roleId,{
        roleName:data.roleName,
        roleDesc:data.roleDesc
    })
}

Vue.prototype.rquest_getRoleById = (data)=>{
    return Axios.get('roles/' + data.roleId)
}

