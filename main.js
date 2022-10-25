
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
 // 按需导入 $http 对象
  import { $http } from '@escook/request-miniprogram'
  // 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
  uni.$http = $http
  // $http.baseUrl = 'https://www.uinav.com'
  $http.baseUrl = 'https://api-hmugo-web.itheima.net'  
  // 请求拦截器  请求开始之前做一些事情
  $http.beforeRequest = function (options) {
    // 数据请求开始加载动画开启
    uni.showLoading({
      title: '数据加载中...',
    })
  }
  // 响应拦截器   请求完成之后做一些事情
  $http.afterRequest = function () {
    // 数据请求成功或失败关闭加载动画
    uni.hideLoading()
  }
// 封装弹窗的方法 提示的参数以传递的为主,如果没有传递则以默认的为主
uni.$showMsg = function(title = '数据请求失败!',duration = 1500){
  // uni可以调用小程序里面的api
  uni.showToast({
      title,
      duration,
      icon: 'none',
    })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif