/**
 * Build Field Selection
 * Builds MongoDB projection object
 */

/**
 * Build field selection object
 * @param {String} fieldsString - Comma-separated fields
 * @param {Array<String>} excludeFields - Fields to exclude
 * @returns {Object} MongoDB projection object
 */
export const buildFieldSelection = (fieldsString, excludeFields = []) => {
  if (!fieldsString) {
    return excludeFields.length > 0
      ? excludeFields.reduce((acc, field) => {
          acc[field] = 0;
          return acc;
        }, {})
      : {};
  }

  const projection = {};
  const fields = fieldsString.split(",");

  fields.forEach((field) => {
    if (field.startsWith("-")) {
      projection[field.substring(1)] = 0;
    } else {
      projection[field] = 1;
    }
  });

  return projection;
};
