/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const output = [...arr]

  output.sort((a, b) => {
    if (param === 'desc') {
      const result = b[0].localeCompare(a[0], ['ru', 'en'], { caseFirst: 'upper' })
      return result !== 0 ? result : -1
    }

    return a[0].localeCompare(b[0], ['ru', 'en'], { caseFirst: 'upper' })
  })

  return output
}

