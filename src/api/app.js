import request from '@/utils/request'

export function uploadApp(data) {
  return request({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/app/upload',
    data
  })
}

export function deleteApp(id) {
  return request({
    method: 'delete',
    url: `/app/${id}`
  })
}

export function updateApp(data) {
  return request({
    method: 'post',
    url: '/app/update',
    data
  })
}

export function getAppList(params) {
  return request({
    method: 'post',
    url: '/app/list',
    params
  })
}

export function aaptDumpBadging(appId) {
  return request({
    method: 'get',
    url: `/app/${appId}/aaptDumpBadging`
  })
}
