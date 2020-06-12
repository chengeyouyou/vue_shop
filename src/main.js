import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'network/'
import ZkTable from 'vue-table-with-tree-grid'
import VeLine from 'v-charts/lib/line.common'
import 'echarts/lib/component/title';

Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)
Vue.component('VeLine', VeLine)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
