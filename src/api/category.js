import request from '@/utils/request'

export function addCategory(data) {
  return request({
    method: 'post',
    url: '/category/add',
    data
  })
}

export function deleteCategory(id, type, projectId) {
  return request({
    method: 'delete',
    url: `/category/${id}/type/${type}/project/${projectId}`
  })
}

export function updateCategory(data) {
  return request({
    method: 'post',
    url: '/category/update',
    data
  })
}

export function getCategoryList(params) {
  return request({
    method: 'post',
    url: '/category/list',
    params
  })
}


export function getCategoryTree(projectId, type) {
  return request({
    method: 'get',
    url: '/category/tree',
    params: {
      projectId,
      type
    }
  })
}

