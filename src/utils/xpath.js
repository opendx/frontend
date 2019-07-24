// xpath 计算 from macaca app-inspector https://github.com/macacajs/app-inspector/blob/master/assets/libs/xpath.js
const arrKeyAttrs = [
  'resource-id', // Android
  'rawIndentifier', // iOS
  'name', // Android & iOS
  'text', // Android
  'value', // iOS
  'content-desc' // Android
]

let mapIdCount = {}
let mapRawIndentifierCount = {}
let mapTextCount = {}
let mapNameCount = {}
let mapValueCount = {}
let mapContentDescCount = {}
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
            case 'rawIndentifier':
              mapRawIndentifierCount[value] = mapRawIndentifierCount[value] && mapRawIndentifierCount[value] + 1 || 1
              break
            case 'name':
              mapNameCount[value] = mapNameCount[value] && mapNameCount[value] + 1 || 1
              break
            case 'text':
              mapTextCount[value] = mapTextCount[value] && mapTextCount[value] + 1 || 1
              break
            case 'value':
              mapValueCount[value] = mapValueCount[value] && mapValueCount[value] + 1 || 1
              break
            case 'content-desc':
              mapContentDescCount[value] = mapValueCount[value] && mapValueCount[value] + 1 || 1
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
  mapRawIndentifierCount = {}
  mapTextCount = {}
  mapNameCount = {}
  mapValueCount = {}
  mapContentDescCount = {}
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
    // const value = current['value']
    const rawIndentifier = current['rawIndentifier']
    const contentDesc = current['content-desc']

    const index = getChildIndex(current, nodes)

    if (resourceId && mapIdCount[resourceId] === 1 && resourceId.trim()) {
      XPath = `/*[@resource-id='${resourceId.trim()}']`
    } else if (rawIndentifier && mapRawIndentifierCount[rawIndentifier] === 1 && rawIndentifier.trim()) {
      XPath = `/*[@name='${rawIndentifier.trim()}']`
    } else if (name && mapNameCount[name] === 1 && name.trim()) {
      XPath = `/*[@name='${name.trim()}']`
    } else if (text && mapTextCount[text] === 1 && text.trim()) {
      XPath = `/*[@text='${text.trim()}']`
    } else if (contentDesc && mapContentDescCount[contentDesc] === 1 && contentDesc.trim()) {
      XPath = `/*[@content-desc='${contentDesc.trim()}']`
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
  mapRawIndentifierCount = {}
  mapTextCount = {}
  mapNameCount = {}
  mapValueCount = {}
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

    if (resourceId && mapIdCount[resourceId] === 1 && resourceId.trim()) {
      androidUiautomator = `new UiSelector().resourceId('${resourceId.trim()}')`
    } else if (text && mapTextCount[text] === 1 && text.trim()) {
      androidUiautomator = `new UiSelector().text('${text.trim()}')`
    } else if (contentDesc && mapContentDescCount[contentDesc] === 1 && contentDesc.trim()) {
      androidUiautomator = `new UiSelector().description('${contentDesc.trim()}')`
    } else {
      androidUiautomator = ''
    }

    nodes = current.nodes
  }
  return androidUiautomator
}
