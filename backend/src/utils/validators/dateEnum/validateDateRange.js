/**
 * Validate Date Range
 * Validates that start date is before end date
 */

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = [];

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.push("Start date must be before end date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
