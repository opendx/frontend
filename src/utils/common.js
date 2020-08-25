export const platforms = [
  {
    type: 1,
    name: 'Android'
  },
  {
    type: 2,
    name: 'iOS'
  },
  {
    type: 3,
    name: 'PC Web'
  }
]

export const stateList = [
  {
    state: 0,
    name: '禁用'
  },
  {
    state: 1,
    name: '草稿'
  },
  {
    state: 2,
    name: '发布'
  }
]

// eg. java.util.List<org.openqa.selenium.WebElement> -> List<WebElement>
// org.openqa.selenium.WebElement -> WebElement
export function getJavaSimpleName(name) {
  if (!name) return name

  const i = name.indexOf('<')
  const j = name.indexOf('>')

  if (i !== -1 && j !== -1) { // 带泛型
    const n1 = name.substring(0, i)
    const n2 = name.substring(i + 1, j)
    return unqualify(n1) + name[i] + unqualify(n2) + name[j]
  } else { // 无泛型
    return unqualify(name)
  }
}

function unqualify(name) {
  if (!name) return name
  return name.substring(name.lastIndexOf('.') + 1)
}

export function copyMatchingKeyValues(source, target) {
  Object.keys(target).forEach(k => {
    if (source[k] !== undefined) {
      source[k] = target[k]
    }
  })
}
