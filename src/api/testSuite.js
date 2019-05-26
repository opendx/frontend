import request from '@/utils/request'

export function addTestSuite(data) {
  return request({
    method: 'POST',
    url: '/testSuite/add',
    data
  })
}

export function getTestSuiteList(params) {
  return request({
    method: 'POST',
    url: '/testSuite/list',
    params
  })
}

