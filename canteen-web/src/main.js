import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import  './utils/adaptation'
import '@/styles/index.scss'

import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import store from './store/index'

import { handleTree } from '@/utils/index.js'
Vue.prototype.handleTree = handleTree

import Print from 'vue-print-nb'
Vue.use(Print);  

import 'default-passive-events'

import Loading from './components/loading'
Vue.use(Loading)

import 'animate.css';

VXETable.renderer.add('NotData', {
  // 空内容模板
  renderEmpty (renderOpts, params) {
    return [
     <div class="el-table__empty-block"></div>
    ]
  }
})
Vue.use(VXETable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
