/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '' || size <= 0) return ''
  if (string.length && !size) return string

  const strToArr = string.split('')
  let localSize = 0
  let totalStr = ''

  strToArr.forEach((letter, i) => {
    if (i === 0) {
      totalStr += letter
      if (strToArr[i + 1] === letter) {
        localSize += 1
      }
    }
    else if (i > 0) {
      if (strToArr[i - 1] === letter && localSize < size) {
        totalStr += letter
        localSize += 1
      }
      else if (strToArr[i - 1] !== letter) {
        totalStr += letter
        localSize = 1
      }
    }
  })

  return totalStr
}
