/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const pickedProps = {}

  for (let prop of fields) {
    if (prop in obj) {
      pickedProps[prop] = obj[prop]
    }
  }

  return pickedProps
};
