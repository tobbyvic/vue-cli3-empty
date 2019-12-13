import request from '@/utils/request';
export function dashStations() {
  return request({
    url: '/api/v2/stationlist',
    method: 'get',
  });
}
