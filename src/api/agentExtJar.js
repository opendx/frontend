import request from '@/utils/request'

export function uploadJar(data) {
  return request({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/agentExtJar/upload',
    data
  })
}

export function deleteJar(id) {
  return request({
    method: 'delete',
    url: `/agentExtJar/${id}`
  })
}

export function getJarList(params) {
  return request({
    method: 'post',
    url: '/agentExtJar/list',
    params
  })
}
