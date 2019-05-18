import request from '@/utils/request'

export function addPage(data) {
  return request({
    method: 'POST',
    url: '/page/add',
    data
  })
}

export function getPageList(params) {
  return request({
    method: 'POST',
    url: '/page/list',
    params: params
  })
}

export function deletePage(pageId) {
  return request({
    method: 'GET',
    url: '/page/delete/' + pageId
  })
}

export function updatePage(data) {
  return request({
    method: 'POST',
    url: '/page/update',
    data
  })
}
