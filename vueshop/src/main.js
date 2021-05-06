import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import'./assets/css/global.css'
// 导入字体图标
import'./assets/fonts/iconfont.css' 
// 导入组件 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// import { config } from 'vue/types/umd'

// 导入moment插件
import moment from 'moment'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过接口获取菜单数据
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.prototype.$moment = moment
Vue.filter('date', res => {
  return moment(res).format('YYYY-MM-DD HH-mm-ss')
})
// 将富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
 