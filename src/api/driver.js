import request from '@/utils/request'

export function addDriver(data) {
  return request({
    method: 'post',
    url: '/driver/add',
    data
  })
}

export function deleteDriver(id) {
  return request({
    method: 'delete',
    url: '/driver/' + id
  })
}

export function updateDriver(data) {
  return request({
    method: 'post',
    url: '/driver/update',
    data
  })
}

export function getDriverList(params) {
  return request({
    method: 'post',
    url: '/driver/list',
    params
  })
}
