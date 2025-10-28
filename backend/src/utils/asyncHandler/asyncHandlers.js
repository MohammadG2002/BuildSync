/**
 * Async Handlers
 * Wraps multiple middleware functions
 */

import { asyncHandler } from "./asyncHandler.js";

/**
 * Wraps multiple middleware functions
 * @param {Array<Function>} middlewares - Array of middleware functions
 * @returns {Array<Function>} Array of wrapped middleware
 */
export const asyncHandlers = (middlewares) => {
  return middlewares.map((middleware) => asyncHandler(middleware));
};
