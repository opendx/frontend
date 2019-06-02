import request from '@/utils/request'

export function getDeviceList(params) {
  return request({
    method: 'post',
    url: '/device/list',
    params
  })
}

export function deviceStart(deviceId) {
  return request({
    method: 'get',
    url: '/device/start/' + deviceId
  })
}

export function getOnlineDevices(platform) {
  return request({
    method: 'get',
    url: '/device/online/' + platform
  })
}
