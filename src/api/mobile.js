import request from '@/utils/request'

export function getMobileList(params) {
  return request({
    method: 'post',
    url: '/mobile/list',
    params
  })
}

export function mobileStart(mobileId) {
  return request({
    method: 'get',
    url: '/mobile/' + mobileId + '/start'
  })
}

export function getOnlineMobiles(platform) {
  return request({
    method: 'get',
    url: '/mobile/online/platform/' + platform
  })
}
