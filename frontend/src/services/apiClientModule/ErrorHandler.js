import { HTTP_STATUS, ERROR_MESSAGES } from "../../config/api.config";
import { TokenManager } from "./TokenManager";

/**
 * Error Handler - Processes API errors and handles specific HTTP status codes
 */
export class ErrorHandler {
  /**
   * Handle API errors based on HTTP status codes
   * @param {Object} error - Error object from API
   * @param {Response} response - Fetch response object
   * @throws {Error} Formatted error with appropriate message
   */
  static handle(error, response) {
    // Network error
    if (!response) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    // Log error for debugging
    console.error("API Error:", {
      status: response.status,
      error: error,
      message: error.message,
      errors: error.errors,
      fullError: JSON.stringify(error, null, 2),
    });

    // Handle specific HTTP status codes
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        this.handleUnauthorized();
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      case HTTP_STATUS.FORBIDDEN:
        throw new Error(error.message || ERROR_MESSAGES.FORBIDDEN);

      case HTTP_STATUS.NOT_FOUND:
        throw new Error(error.message || ERROR_MESSAGES.NOT_FOUND);

      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.VALIDATION_ERROR:
        throw new Error(this.formatValidationError(error));

      case HTTP_STATUS.SERVER_ERROR:
        throw new Error(error.message || ERROR_MESSAGES.SERVER_ERROR);

      default:
        throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
    }
  }

  /**
   * Handle unauthorized errors - clear auth and redirect
   */
  static handleUnauthorized() {
    TokenManager.clearAuthData();
    window.location.href = "/login";
  }

  /**
   * Format validation errors into a readable message
   * @param {Object} error - Error object
   * @returns {string} Formatted error message
   */
  static formatValidationError(error) {
    if (error.errors && Array.isArray(error.errors)) {
      const errorMsg = error.errors.map((e) => e.message).join(", ");
      return errorMsg || error.message || ERROR_MESSAGES.VALIDATION_ERROR;
    }
    return error.message || ERROR_MESSAGES.VALIDATION_ERROR;
  }

  /**
   * Check if error should prevent retry
   * @param {Error} error - Error object
   * @returns {boolean} True if error should not be retried
   */
  static shouldNotRetry(error) {
    return (
      error.message === ERROR_MESSAGES.UNAUTHORIZED ||
      error.message === ERROR_MESSAGES.FORBIDDEN
    );
  }
}
