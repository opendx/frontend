import request from '@/utils/request'

export function addAction(data) {
  return request({
    method: 'POST',
    url: '/action/add',
    data
  })
}

export function updateAction(data) {
  return request({
    method: 'POST',
    url: '/action/update',
    data
  })
}

export function getActionList(params) {
  return request({
    method: 'POST',
    url: '/action/list',
    params
  })
}

export function deleteAction(actionId) {
  return request({
    method: 'GET',
    url: '/action/delete/' + actionId
  })
}

export function debugAction(data) {
  return request({
    method: 'POST',
    url: '/action/debug',
    data
  })
}
