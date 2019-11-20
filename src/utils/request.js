import axios from 'axios';
import { Message } from 'element-ui';
import { getToken } from './token';

// 创建axios实例
const service = axios.create({
  baseURL: '/', // api 的 base_url
  timeout: 10000, // 请求超时时间
});
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
const requestList = [];
// 取消列表
// const { CancelToken } = axios;
// const sources = {};
service.interceptors.request.use((config) => {
  // 将请求地址及参数作为一个完整的请求
  // const request = JSON.stringify(config.url) + JSON.stringify(config.data);
  // eslint-disable-next-line no-param-reassign
  // config.cancelToken = new CancelToken((cancel) => {
  //   sources[request] = cancel;
  // });
  // eslint-disable-next-line no-param-reassign
  config.headers['Cache-Control'] = 'no-cache';
  if (getToken()) {
    // eslint-disable-next-line no-param-reassign
    config.headers.token = getToken();
  }
  // 1.判断请求是否已存在请求列表，避免重复请求，将当前请求添加进请求列表数组；
  // if (requestList.includes(request)) {
  //   sources[request]('取消重复请求');
  // } else {
  //   requestList.push(request);
    // 2.请求开始，改变loading状态供加载动画使用
    // store.dispatch('changeGlobalState', { loading: true });
  // }
  // 3.从store中获取token并添加到请求头供后端作权限校验
  // const { token } = store.getters.userInfo;
  // if (token) {
  //   config.headers.token = token;
  // }
  return config;
}, error => Promise.reject(error));

// 响应拦截器
service.interceptors.response.use((response) => {
  // 1.将当前请求中请求列表中删除
  // const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.data);
  // requestList.splice(requestList.findIndex(item => item === request), 1);
  // 2.当请求列表为空时，更改loading状态
  // if (requestList.length === 0) {
  //   store.dispatch('changeGlobalState', { loading: false });
  // }
  // 3.统一处理权限认证错误管理
  // if (response.data.code === 900401) {
  //   window.ELEMENT.Message.error('认证失效，请重新登录！', 1000);
  //   router.push('/login');
  // }
  // if (response.status !== 200) {
  //   Message({
  //     message: response.message,
  //     type: 'error',
  //     duration: 5 * 1000,
  //   });
  // }
  return response.data;
}, (error) => {
  return Promise.reject(error);
});

export default service;
