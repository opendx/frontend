import request from '@/utils/request'

export function addPage(data) {
  return request({
    method: 'post',
    url: '/page/add',
    data
  })
}

export function getPageById(pageId) {
  return request({
    method: 'get',
    url: '/page/' + pageId
  })
}

export function getPageList(params) {
  return request({
    method: 'post',
    url: '/page/list',
    params
  })
}

export function deletePage(pageId) {
  return request({
    method: 'delete',
    url: '/page/' + pageId
  })
}

export function updatePage(data) {
  return request({
    method: 'post',
    url: '/page/update',
    data
  })
}
