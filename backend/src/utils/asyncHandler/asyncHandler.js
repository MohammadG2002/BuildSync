/**
 * Async Handler
 * Wraps async route handlers to catch errors
 */

/**
 * Wraps an async function to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
