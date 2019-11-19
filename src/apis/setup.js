import request from '@/utils/request';

export function session() {
  return request({
    url: '/api/v1/session',
    method: 'get',
  });
}

export function dbcfg(params) {
  return request({
    url: '/api/v1/dbcfg',
    method: 'post',
    data: params
  });
}

export function station(params) {
  return request({
    url: '/api/v1/station',
    method: 'post',
    data: params
  });
}

export function stations() {
  return request({
    url: '/api/v1/stations',
    method: 'get',
  });
}
