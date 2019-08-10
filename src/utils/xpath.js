// xpath from macaca app-inspector https://github.com/macacajs/app-inspector/blob/master/assets/libs/xpath.js
// 修改了部分代码
const arrKeyAttrs = [
  'resource-id', // Android
  'text', // Android
  'content-desc', // Android
  'name', // iOS
  'value' // iOS
]

let mapIdCount = {}
let mapTextCount = {}
let mapNameCount = {}
let mapContentDescCount = {}
let mapValueCount = {}
let isScan = false

const androidRootName = 'MacacaAppInspectorRoot'

function getChildIndex(node, nodes) {
  let index = 0

  for (let i = 0; i < nodes.length; i++) {
    const item = nodes[i]

    if (item.class === node.class) {
      index++
    }

    if (node === item) {
      break
    }
  }

  return index
}

function scanNode(nodes) {
  if (!isScan) {
    if (!nodes) {
      return
    }

    for (let i = 0; i < nodes.length; i++) {
      const current = nodes[i]
      arrKeyAttrs.forEach(attr => {
        const value = current[attr]

        if (value) {
          switch (attr) {
            case 'resource-id':
              mapIdCount[value] = mapIdCount[value] && mapIdCount[value] + 1 || 1
              break
            case 'name':
              mapNameCount[value] = mapNameCount[value] && mapNameCount[value] + 1 || 1
              break
            case 'text':
              mapTextCount[value] = mapTextCount[value] && mapTextCount[value] + 1 || 1
              break
            case 'content-desc':
              mapContentDescCount[value] = mapContentDescCount[value] && mapContentDescCount[value] + 1 || 1
              break
            case 'value':
              mapValueCount[value] = mapValueCount[value] && mapValueCount[value] + 1 || 1
              break
          }
        }
      })
      scanNode(current.nodes)
    }
  }
}

export function getXPathLite(tree, nodePath) {
  mapIdCount = {}
  mapTextCount = {}
  mapNameCount = {}
  mapContentDescCount = {}
  mapValueCount = {}
  isScan = false

  scanNode([tree])
  isScan = true

  // const array = []
  let nodes = [tree]
  const paths = [0, ...nodePath]

  let XPath = ''

  for (let i = 0; i < paths.length; i++) {
    const current = nodes[paths[i]]
    const name = current['name']
    const resourceId = current['resource-id']
    const text = current['text']
    const contentDesc = current['content-desc']
    const value = current['value']

    const index = getChildIndex(current, nodes)

    if (resourceId && mapIdCount[resourceId] === 1) {
      XPath = `/${current.class}[@resource-id='${resourceId}']`
    } else if (name && mapNameCount[name] === 1) {
      XPath = `/${current.class}[@name='${name}']`
    } else if (text && mapTextCount[text] === 1) {
      XPath = `/${current.class}[@text='${text}']`
    } else if (contentDesc && mapContentDescCount[contentDesc] === 1) {
      XPath = `/${current.class}[@content-desc='${contentDesc}']`
    } else if (value && mapValueCount[value] === 1) {
      XPath = `/${current.class}[@value='${value}']`
    } else {
      if (current.class !== androidRootName) {
        XPath = `${XPath}/${current.class}[${index}]`
      }
    }
    nodes = current.nodes
  }
  return `/${XPath}`
}

export function getXPath(tree, nodePath) {
  const array = []
  let nodes = [tree]
  const paths = [0, ...nodePath]

  for (let i = 0; i < paths.length; i++) {
    const current = nodes[paths[i]]
    const index = getChildIndex(current, nodes)

    const tagName = current.class

    if (current.class !== androidRootName) {
      array.push(`${tagName}[${index}]`)
    }
    nodes = current.nodes
  }

  return `//${array.join('/')}`
}

export function getAndroidUiautomator(tree, nodePath) {
  mapIdCount = {}
  mapTextCount = {}
  mapNameCount = {}
  mapContentDescCount = {}
  isScan = false

  scanNode([tree])
  isScan = true

  // const array = []
  let nodes = [tree]
  const paths = [0, ...nodePath]

  let androidUiautomator = ''

  for (let i = 0; i < paths.length; i++) {
    const current = nodes[paths[i]]
    const resourceId = current['resource-id']
    const text = current['text']
    const contentDesc = current['content-desc']

    if (resourceId && mapIdCount[resourceId] === 1) {
      androidUiautomator = `new UiSelector().resourceId('${resourceId}')`
    } else if (text && mapTextCount[text] === 1) {
      androidUiautomator = `new UiSelector().text('${text}')`
    } else if (contentDesc && mapContentDescCount[contentDesc] === 1) {
      androidUiautomator = `new UiSelector().description('${contentDesc}')`
    } else {
      androidUiautomator = ''
    }

    nodes = current.nodes
  }
  return androidUiautomator
}

export function getIOSNsPredicateString(tree, nodePath) {
  mapNameCount = {}
  mapValueCount = {}
  isScan = false

  scanNode([tree])
  isScan = true

  // const array = []
  let nodes = [tree]
  const paths = [0, ...nodePath]

  let iOSNsPredicateString = ''

  for (let i = 0; i < paths.length; i++) {
    const current = nodes[paths[i]]
    const name = current['name']
    const value = current['value']

    if (name && mapNameCount[name] === 1) {
      iOSNsPredicateString = `type == '${current.type}' AND name == '${current.name}'`
    } else if (value && mapValueCount[value] === 1) {
      iOSNsPredicateString = `type == '${current.type}' AND value == '${current.value}'`
    } else {
      iOSNsPredicateString = ''
    }

    nodes = current.nodes
  }
  return iOSNsPredicateString
}
