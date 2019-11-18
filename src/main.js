import ElementUI from 'element-ui';
import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';

import 'element-ui/lib/theme-chalk/index.css';
import './styles/common.css'; // 全局引入样式，需遵循BEM语法

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
