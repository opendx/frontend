import request from '@/utils/request'

export function getOnlineAgentList() {
  return request({
    url: '/agent/online',
    method: 'get'
  })
}
