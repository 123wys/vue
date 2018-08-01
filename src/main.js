import Vue from 'vue'
import App from './App'
import store from './store'
/* eslint-disable no-new */
import 'babel-polyfill'
import VueRouter from 'vue-router'
import routerConfig from './router'
import ElementUI from 'element-ui'
import 'assets/theme/index.css'
import myTransition from './transition/transitionGrop.js'
import { baseUrl } from './assets/baseUrl.js'
import searchNull from './components/searchNull/searchNull.vue'
import waitProduct from './components/searchNull/waitProduct.vue'
Vue.use(ElementUI)
Vue.use(VueRouter)
  //  全局注册动画组件
Vue.use(myTransition)
  //  全局注册搜索为空组件
Vue.component('searchNull', searchNull)
Vue.component('waitProduct', waitProduct)
const router = new VueRouter(routerConfig);

  /* axios默认配置 */
import axios from 'axios';
// axios.defaults.baseURL = 'http://101.37.103.127:8080/';
axios.defaults.baseURL = 'http://192.168.70.250:3000/';
axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 2 * 60 * 1000;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => response, function(err) {
  if (err.response && err.response.data && err.response.data === 'no logined') {
    // router.push('/login');
    window.location.href = '/';
  }
  return Promise.reject(err);
});
//  全局挂在axios
Vue.prototype.axios = axios;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  },
})
