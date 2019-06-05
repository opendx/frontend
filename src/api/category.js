import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    method: 'post',
    url: '/category/list',
    params
  })
}

export function addCategory(data) {
  return request({
    method: 'post',
    url: '/category/add',
    data
  })
}

export function deleteCategory(id) {
  return request({
    method: 'delete',
    url: '/category/' + id
  })
}

