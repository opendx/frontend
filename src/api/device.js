import request from '@/utils/request'

export function getDeviceList(device) {
  return request({
    method: 'POST',
    url: '/device/list',
    params: device
  })
}

export function deviceStart(deviceId) {
  return request({
    method: 'GET',
    url: '/device/start/' + deviceId
  })
}

export function getOnlineDevices(platform) {
  return request({
    method: 'GET',
    url: '/device/online/' + platform
  })
}
