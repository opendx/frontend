import request from '@/utils/request'

export function commitTestTask(data) {
  return request({
    method: 'POST',
    url: '/testTask/commit',
    data
  })
}

export function getTestTaskList(params) {
  return request({
    method: 'POST',
    url: '/testTask/list',
    params
  })
}
