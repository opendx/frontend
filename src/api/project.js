import request from '@/utils/request'

export function addProject(data) {
  return request({
    method: 'post',
    url: '/project/add',
    data
  })
}

export function deleteProject(id) {
  return request({
    method: 'get',
    url: '/project/delete/' + id
  })
}

export function updateProject(data) {
  return request({
    method: 'post',
    url: '/project/update',
    data
  })
}

export function getProjectList(params) {
  return request({
    method: 'post',
    url: '/project/list',
    params
  })
}
