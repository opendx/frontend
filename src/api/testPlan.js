import request from '@/utils/request'

export function addTestPlan(data) {
  return request({
    url: '/testPlan/add',
    method: 'POST',
    data
  })
}

export function deleteTestPlan(testPlanId) {
  return request({
    url: '/testPlan/delete/' + testPlanId,
    method: 'GET'
  })
}

export function updateTestPlan(data) {
  return request({
    url: '/testPlan/update',
    method: 'POST',
    data
  })
}

export function getTestPlanList(params) {
  return request({
    url: '/testPlan/list',
    method: 'POST',
    params
  })
}
