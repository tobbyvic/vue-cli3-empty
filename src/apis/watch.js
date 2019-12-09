import request from '@/utils/request';

export function getWatchs(params) {
  return request({
    url: '/api/v2/watchs',
    method: 'get',
    params: params
  });
}

export function addWatch(params) {
  return request({
    url: '/api/v2/watchs',
    method: 'post',
    data: params
  });
}

export function updateWatch(params) {
  return request({
    url: '/api/v2/watchs',
    method: 'post',
    data: params
  });
}

export function delWatch(params) {
  return request({
    url: '/api/v2/delwatch',
    method: 'delete',
    params: params
  });
}
