import request from '@/utils/request'

export function commitTestTask(params) {
  return request({
    method: 'get',
    url: '/testTask/commit',
    params
  })
}

export function deleteTestTask(testTaskId) {
  return request({
    method: 'delete',
    url: '/testTask/' + testTaskId
  })
}

export function getTestTaskList(params) {
  return request({
    method: 'post',
    url: '/testTask/list',
    params
  })
}

export function getTestTaskSummary(testTaskId) {
  return request({
    method: 'get',
    url: '/testTask/' + testTaskId + '/summary'
  })
}
