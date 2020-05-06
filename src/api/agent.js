import { service } from '@/utils/agentRequest'

export function screenshot(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/device/' + deviceId + '/screenshot'
  })
}

export function dump(agentIp, agentPort, deviceId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/device/' + deviceId + '/dump'
  })
}

export function installApp(agentIp, agentPort, mobileId, data) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/mobile/' + mobileId + '/installApp',
    data
  })
}

export function startAdbKit(agentIp, agentPort, mobileId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + mobileId + '/adbkit/start'
  })
}

export function stopAdbKit(agentIp, agentPort, mobileId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + mobileId + '/adbkit/stop'
  })
}

export function getImeList(agentIp, agentPort, mobileId) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'get',
    url: '/android/' + mobileId + '/imeList'
  })
}

export function setIme(agentIp, agentPort, mobileId, ime) {
  const request = service(agentIp, agentPort)
  return request({
    method: 'post',
    url: '/android/' + mobileId + '/ime',
    params: { ime }
  })
}
