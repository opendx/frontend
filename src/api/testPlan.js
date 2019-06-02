import request from '@/utils/request'

export function addTestPlan(data) {
  return request({
    url: '/testPlan/add',
    method: 'post',
    data
  })
}

export function deleteTestPlan(testPlanId) {
  return request({
    url: '/testPlan/delete/' + testPlanId,
    method: 'get'
  })
}

export function updateTestPlan(data) {
  return request({
    url: '/testPlan/update',
    method: 'post',
    data
  })
}

export function getTestPlanList(params) {
  return request({
    url: '/testPlan/list',
    method: 'post',
    params
  })
}
