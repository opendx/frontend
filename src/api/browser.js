import request from '@/utils/request'

export function getBrowserList(params) {
  return request({
    method: 'post',
    url: '/browser/list',
    params
  })
}

export function browserStart(browserId) {
  return request({
    method: 'get',
    url: `/browser/${browserId}/start`
  })
}

export function getOnlineBrowsers() {
  return request({
    method: 'get',
    url: '/browser/online'
  })
}
