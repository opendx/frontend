import request from '@/utils/request'

export function commitTestTask(data) {
  return request({
    method: 'post',
    url: '/testTask/commit',
    data
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

export function getTestTaskProgress(testTaskId) {
  return request({
    method: 'get',
    url: '/testTask/' + testTaskId + '/progress'
  })
}
