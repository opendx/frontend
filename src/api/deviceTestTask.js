import request from '@/utils/request'

export function getDeviceTestTaskList(params) {
  return request({
    method: 'POST',
    url: '/deviceTestTask/list',
    params
  })
}
