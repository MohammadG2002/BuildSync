/**
 * Validate Enum Value
 * Checks if value is in allowed values
 */

/**
 * Validate enum value
 * @param {*} value - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @returns {Boolean} True if value is in allowed values
 */
export const isValidEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};
