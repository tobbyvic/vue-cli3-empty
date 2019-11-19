import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../components/Layout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/setup',
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

export default router;
