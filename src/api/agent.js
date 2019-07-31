import { service } from '@/utils/agentRequest'

export function screenshot(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/mobile/' + deviceId + '/screenshot'
  })
}

export function dump(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/mobile/' + deviceId + '/dump'
  })
}

export function freshDriver(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/mobile/' + deviceId + '/freshDriver'
  })
}

export function installApp(agentIp, agentPort, deviceId, data) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/mobile/' + deviceId + '/installApp',
    data
  })
}

export function startAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + deviceId + '/adbkit/start'
  })
}

export function stopAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + deviceId + '/adbkit/stop'
  })
}
