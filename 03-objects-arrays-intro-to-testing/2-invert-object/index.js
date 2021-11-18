/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) {
    return obj
  }
  else if (!Object.keys(obj).length) {
    return obj
  } else {
    return Object.entries(obj).reduce((previous, [currentKey, currentValue]) => ({ ...previous, [currentValue]: currentKey }), {})
  }
}
