import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import 'src/assets/css/reset.css'
import ElementUI from 'element-ui'
import 'src/assets/css/element-variables.scss'
import 'src/assets/css/common.scss'
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import store from './vuex/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {routes} from './routes'
// import EasyScroll from 'easyscroll';

//mockdata数据模拟
//import Mock from './mock'
//Mock.bootstrap();
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

sessionStorage.removeItem('selectList');  //清除已选择缓存

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueCookie);
Vue.use(VueAxios, axios)
// Vue.use(EasyScroll);

// axios默认传统表单提交方式
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 配置全局根路径
var rootUrl = CONFIG.rootUrl;
global.Path = axios.defaults.baseURL = rootUrl;
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = VueCookie.get('user_token');// || 'iprp_member-1c9923cdc0c1475cb69506c01a46a0708a6792c29d3a4a8abbb0d245eb31035f';
    // config.headers['Cache-Control'] = 'no-cache';
    config.headers['If-Modified-Since'] = '0';
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// 拦截未登录
axios.interceptors.response.use(function (response) {
  // Do something with response data
  var status = response.status;
  var data = response.data;
  //401表示token错误
  if (status === 200 && data.code === 401) {
    var hash = location.hash;
    if (hash.indexOf('return_url') === -1) {
      /*if (rootUrl.indexOf('localhost') !== -1) {
        location.href = 'http://localhost:8082/#/access/login?return_url='+ location.href;
      }else{
        location.href = rootUrl + '/iprp/#/access/login?return_url='+ location.href;
      }*/
    }
  }
  return response;
}, function (error) {
  // Do something with response error
  var data = error.response.data;
  //401表示token错误
  if (data.status === 401) {
    var hash = location.hash;
    if (hash.indexOf('return_url') === -1) {
      if (rootUrl.indexOf('localhost') !== -1) {
        location.href = 'http://localhost:8082/#/access/wechat?return_url='+ location.href;
      }else{
        location.href = rootUrl + '/iprp/#/access/wechat?return_url='+ location.href;
      }
    }
  }
  return Promise.reject(error);
});

NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

const LoginUser = {
    member_id:'',
    email:'',
    phone:'',
    token:'',
    nickname:'',
    truename:'',
    avatar:'',
    sex:'',
    area_info:'',
    member_address:'',
    organization_id:'',
    parent:{
      member_id:'',
    },
};

//默认跳转登录页面
/*router.beforeEach((to, from, next) => {
  next({ path: '/login' })
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})*/

//用户登录信息初始化
//默认跳转官网登录页面(根据用户token过期时间)
//router.push({ path: '/main' });
/*router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  NProgress.start();
})*/

/*router.afterEach(transition => {
  NProgress.done();
});*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

