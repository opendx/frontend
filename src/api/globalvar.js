import request from '@/utils/request'

export function addGlobalVar(data) {
  return request({
    method: 'post',
    url: '/globalVar/add',
    data
  })
}

export function updateGlobalVar(data) {
  return request({
    method: 'post',
    url: '/globalVar/update',
    data
  })
}

export function getGlobalVarList(params) {
  return request({
    method: 'post',
    url: '/globalVar/list',
    params
  })
}

export function deleteGlobalVar(globalVarId) {
  return request({
    method: 'get',
    url: '/globalVar/delete/' + globalVarId
  })
}
