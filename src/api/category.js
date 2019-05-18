import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    method: 'POST',
    url: '/category/list',
    params: params
  })
}

export function addCategory(data) {
  return request({
    method: 'POST',
    url: '/category/add',
    data
  })
}

