/**
 * Build Date Range Query
 * Builds MongoDB date range query
 */

/**
 * Build date range query
 * @param {Object} dateFilters - Object with startDate and/or endDate
 * @param {String} fieldName - Field name for date (default: "createdAt")
 * @returns {Object} MongoDB date range query
 */
export const buildDateRangeQuery = (dateFilters, fieldName = "createdAt") => {
  const query = {};

  if (dateFilters.startDate || dateFilters.endDate) {
    query[fieldName] = {};

    if (dateFilters.startDate) {
      query[fieldName].$gte = new Date(dateFilters.startDate);
    }

    if (dateFilters.endDate) {
      query[fieldName].$lte = new Date(dateFilters.endDate);
    }
  }

  return query;
};
