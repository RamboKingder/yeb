import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

import {getRequest} from "@/utils/api"
import {postRequest} from "@/utils/api"
import {putRequest} from "@/utils/api"
import {deleteRequest} from "@/utils/api"
import {initMenu} from "@/utils/menus";

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest=postRequest
Vue.prototype.putRequest=putRequest
Vue.prototype.deleteRequest=deleteRequest

Vue.config.productionTip = false
Vue.use(ElementUI);


// // 没有头像功能时的版本
// router.beforeEach((to, from, next) => {
//   // alert('beforeEach被执行了');
//   if (window.sessionStorage.getItem('tokenStr')) {
//     // alert("由于session中存在tokenStr，initMenu()方法被执行了一下")
//     initMenu(router, store);
//     next();
//   } else {
//     next();
//   }
// })

// 加上头像功能
router.beforeEach((to, from, next) => {
  // alert("beforEach... to.path="+to.path);
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store);
    // alert("刚刚加载完了菜单");
    if (!window.sessionStorage.getItem('user')) {
      //判断用户信息是否存在
      return getRequest('/admin/info').then(resp=>{
        if (resp) {
          //存入用户信息
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          console.log("即将跳转到:" + to.path);
          next();
          console.log("理论上已经跳转到了" + to.path);
        }
      })
    }
    next();
  } else {
    console.log("6666666666")
    if (to.path == '/'){
      next();
    }else{
      next('/?redirect='+to.path);
    }
  }
})


// // 路由前置守卫
// router.beforeEach((to, from, next) => {
//   if (window.sessionStorage.getItem('tokenStr')) {
//     initMenu(router, store);
//     //判断用户信息是否存在
//     if (!window.sessionStorage.getItem('user')) {
//       // console.log('123');
//       return getRequest('/admin/info').then(resp=>{
//         if (resp) {
//           //存入用户信息
//           window.sessionStorage.setItem('user', JSON.stringify(resp));
//           next();
//         }
//       })
//     }
//     next();
//   }else {
//     if (to.path == '/') {
//       next();
//     }else {
//       next('/?redirect=' + to.path);
//     }
//   }
// });


//!!!这个组件挂载必须放在最下面!!!
// 否则会造成刷新页面不触发beforeEach导致菜单栏丢失的bug
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
