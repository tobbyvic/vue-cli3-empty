import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../components/Layout.vue';
import {session} from '@/apis/setup';
import { setToken } from '@/utils/token';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'setup',
      name: 'setup',
      component: () => import('../views/Setup.vue'),
    },{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
    }],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

// 导航守卫
// router.beforeEach((to, from, next) => {
  // 前往非setup
  // if (to !== '/setup') {
  //   session().then((res) => {
  //     if (res.success) {
  //       next('/setup');
  //     } else {
  //       next();
  //     }
  //   }).catch((e) => {
  //     next();
  //   });
  // } else {
  //   session().then(async res => {
  //     if (res.success) {
  //       setToken(res.data);
  //       next()
  //     } else {
  //       next('/dashboard');
  //     }
  //   }).catch(e => {
  //     next('/dashboard');
  //   });
  // }
// });

export default router;
