import request from '@/utils/request';
export function dashStations() {
  return request({
    url: '/api/v2/stationlist',
    method: 'get',
  });
}

export function dashFilePaths() {
  return request({
    url: '/api/v2/stations',
    method: 'get',
  });
}

export function modifyFilePaths(params) {
  return request({
    url: '/api/v2/stations',
    method: 'post',
    data: params
  });
}

export function validatePwd(params) {
  return request({
    url: '/api/v2/login/0',
    method: 'post',
    data: params
  });
}

export function modifyPwd(params) {
  return request({
    url: '/api/v2/login/1',
    method: 'post',
    data: params
  });
}
