// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import goods from '@components/goods/goods';
import ratings from '@components/ratings/ratings';
import seller from '@components/seller/seller';
import axios from 'axios';
import '@common/stylus/index.styl';
Vue.use(VueRouter);
// Vue.use(axios);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

const routes = [
  { path: '/goods', component: goods },
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller},
  { path: '/', redirect: '/goods' }

];
// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active'
});
// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
 new Vue({
  router,
  template: '<App/>',
  components: {
    App
  },
  data: {
    eventHub: new Vue()
  }
}).$mount('#app');
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   VueRouter,
//   template: '<App/>',
//   components: { App }
// });
