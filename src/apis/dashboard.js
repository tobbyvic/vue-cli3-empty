import request from '@/utils/request';
export function dashStations() {
  return request({
    url: '/api/v2/stations',
    method: 'get',
  });
}
