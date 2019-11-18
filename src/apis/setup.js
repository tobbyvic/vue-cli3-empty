import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function test() {
  return request({
    url: '/setup/test',
    method: 'get',
  });
}
