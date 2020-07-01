import request from '@/utils/request'

export function addGlobalVar(data) {
  return request({
    method: 'post',
    url: '/globalVar/add',
    data
  })
}

export function addGlobalVars(data) {
  return request({
    method: 'post',
    url: '/globalVar/addBatch',
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
    method: 'delete',
    url: `/globalVar/${globalVarId}`
  })
}
