/**
 * 用途：检查输入的电话号码格式是否正确
输入：
strPhone：字符串
返回：
如果通过验证返回true,否则返回false
 * @param {*} strPhone 
 */
export function checkPhone(phone){ 
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
        return false; 
    } 
    return true;
}

//检查邮箱
export function checkEmail(email){ 
    if(!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email))){ 
        return false; 
    } 
    return true;
}