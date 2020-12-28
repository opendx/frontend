// module.exports = angular.module('stf.keycodes', [
//
// ])
//   .factory('KeycodesMapped', function() {
//     return require('./mapped/index.json')
//   })

// Not used for now:
//
//  .factory('KeycodesAndroid', function () {
//    return require('./android/index.json')
//  })
//  .factory('KeycodesJS', function () {
//    return require('./android/index.json')
//  })
//  .factory('KeycodesService', require('./keycodes-service'))

import KeycodesServiceFactory from './keycodes-service'
import androidKeycodes from './android/index.json'
import jsKeycodes from './js/index.json'

const service = KeycodesServiceFactory(androidKeycodes, jsKeycodes)

export default function MapToAndroid(key) {
  return service.mapToAndroid(key)
}
