import Vue from 'vue';
import Axios from 'axios'


//商品列表数据
Vue.prototype.rquest_getGoodsList = (data) => {
    return Axios.get('goods', {
        params: data
    })
}

//添加商品
Vue.prototype.rquest_addGoods = (data) => {
    return Axios.post('goods', data)
}

//根据 ID 查询商品
Vue.prototype.rquest_getGoods = (data) => {
    return Axios.get('goods/' + data.goods_id)
}

//编辑提交商品
Vue.prototype.rquest_editGoods = (data) => {
    return Axios.put('goods/' + data.goods_id, data)
}

//删除商品
Vue.prototype.rquest_deleteGoods = (data) => {
    return Axios.delete('goods/' + data.goods_id)
}

