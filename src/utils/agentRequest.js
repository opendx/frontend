import axios from 'axios'
import { Message } from 'element-ui'

export function service(agentIp, agentPort) {
  const service = axios.create({
    baseURL: 'http://' + agentIp + ':' + agentPort, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 600000 // request timeout
  })
  // request interceptor
  service.interceptors.request.use(
    config => {
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      const res = response.data
      if (res.status !== 1) {
        Message({
          message: res.msg || 'error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res.msg || 'error')
      } else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )
  return service
}
