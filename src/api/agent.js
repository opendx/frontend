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

export function startAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/adbkit/start/' + deviceId,
    method: 'GET'
  })
}

export function stopAdbKit(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/adbkit/stop/' + deviceId,
    method: 'GET'
  })
}

export function startUiautomator2Server(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/uiautomator2server/start/' + deviceId,
    method: 'GET'
  })
}

export function installApk(agentIp, agentPort, deviceId, form) {
  const request = service(agentIp, agentPort)
  return request({
    url: '/android/installApk/' + deviceId,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: form
  })
}
