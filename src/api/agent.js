import { service } from '@/utils/agentRequest'

export function screenshot(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/screenshot/' + deviceId,
    method: 'GET'
  })
}

export function dump(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/uiautomator2/dump/' + deviceId,
    method: 'GET'
  })
}
