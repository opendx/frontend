import request from '@/utils/request'

// 新增项目
export function addProject(data) {
  return request({
    method: 'POST',
    url: '/project/add',
    data: data
  })
}

// 删除项目
export function deleteProject(id) {
  return request({
    method: 'GET',
    url: '/project/delete/' + id
  })
}

// 修改项目
export function updateProject(data) {
  return request({
    method: 'POST',
    url: '/project/update',
    data: data
  })
}

// 查询项目列表
export function getProjectList(params) {
  return request({
    method: 'POST',
    url: '/project/list',
    params: params
  })
}
