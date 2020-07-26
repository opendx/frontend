import request from '@/utils/request'

export function getServerVersion() {
  return request({
    method: 'get',
    url: '/application/version'
  })
}
