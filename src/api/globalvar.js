import request from '@/utils/request'

export function addGlobalVar(data) {
  return request({
    method: 'POST',
    url: '/globalVar/add',
    data: data
  })
}

export function updateGlobalVar(data) {
  return request({
    method: 'POST',
    url: '/globalVar/update',
    data: data
  })
}

export function getGlobalVarList(params) {
  return request({
    method: 'POST',
    url: '/globalVar/list',
    params: params
  })
}

export function deleteGlobalVar(globalVarId) {
  return request({
    method: 'GET',
    url: '/globalVar/delete/' + globalVarId
  })
}
