import request from '@/utils/request'

export function addTestSuite(data) {
  return request({
    method: 'post',
    url: '/testSuite/add',
    data
  })
}

export function getTestSuiteList(params) {
  return request({
    method: 'post',
    url: '/testSuite/list',
    params
  })
}

