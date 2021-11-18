/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const fieldsToObject = fields.reduce((previous, current) => ({ ...previous, [current]: current}), {})
  const omitObject = {}

  for (let [key, value] of Object.entries(obj)) {
    if (key !== fieldsToObject[key]) {
      omitObject[key] = value
    }
  }

  return omitObject
};
