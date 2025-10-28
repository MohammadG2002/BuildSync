/**
 * Send Paginated Response
 */

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Data array
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} total - Total items count
 * @param {String} message - Success message
 */
export const sendPaginated = (
  res,
  data,
  page,
  limit,
  total,
  message = "Data fetched successfully"
) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      itemsPerPage: limit,
      totalItems: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};
