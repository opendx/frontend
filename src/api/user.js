import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    method: 'post',
    url: '/user/add',
    data
  })
}

export function deleteUser(id) {
  return request({
    method: 'delete',
    url: '/user/' + id
  })
}

export function updateUser(data) {
  return request({
    method: 'post',
    url: '/user/update',
    data
  })
}

export function getUserList(params) {
  return request({
    method: 'post',
    url: '/user/list',
    params
  })
}
