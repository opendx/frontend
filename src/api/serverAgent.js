import request from '@/utils/request'

export function getOnlineAgentList() {
  return request({
    url: '/agent/list/online',
    method: 'get'
  })
}
