/**
 * Created by codoon on 16/8/3.
 */
import Vue from 'vue';
import VueResource from 'vue-resource';

// 请求发送
Vue.use(VueResource);
Vue.http.options.credentials = true;
Vue.http.options.crossDomain = true;

// 配置接口
var URL = '';
var INTERFACE = {};


// 设置token值
function setToken(token){
  if(!token) return false;
  Vue.http.interceptors((request, next) => {
    request.headers.token = token;
    next();
  })
}
// 导出
module.exports = {

};
