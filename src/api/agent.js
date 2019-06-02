import { service } from '@/utils/agentRequest'

export function screenshot(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/screenshot/' + deviceId,
    method: 'get'
  })
}

export function dump(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/uiautomator2/dump/' + deviceId,
    method: 'get'
  })
}

export function startAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/adbkit/start/' + deviceId,
    method: 'get'
  })
}

export function stopAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/adbkit/stop/' + deviceId,
    method: 'get'
  })
}

export function startUiautomator2Server(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/uiautomator2server/start/' + deviceId,
    method: 'get'
  })
}

export function installApk(agentIp, agentPort, deviceId, data) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/installApk/' + deviceId,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
