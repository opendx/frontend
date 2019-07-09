import { service } from '@/utils/agentRequest'

export function screenshot(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + deviceId + '/screenshot'
  })
}

export function dump(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + deviceId + '/uiautomator2/dump'
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

export function freshAndroidDriver(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + deviceId + '/freshAndroidDriver'
  })
}

export function installApk(agentIp, agentPort, deviceId, data) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/android/' + deviceId + '/installApk',
    data
  })
}
