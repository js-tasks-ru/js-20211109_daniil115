/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const splitPath = path.split('.')
  const getValue = (obj, arr, index) => obj[arr[index]]
  let counter = 0

  return function getRecursiveValue(object) {
    const value = getValue(object, splitPath, counter)

    if ((typeof value !== 'object') && counter === 0) {
      return value
    }
    else if ((typeof value !== 'object') && counter !== 0) {
      return value
    }
    else {
      counter += 1
      return getRecursiveValue(value)
    }

  }
}
