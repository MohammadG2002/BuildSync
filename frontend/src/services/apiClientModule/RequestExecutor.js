import { API_CONFIG, ERROR_MESSAGES } from "../../config/api.config";
import { HeaderBuilder } from "./HeaderBuilder";
import { ErrorHandler } from "./ErrorHandler";
import { RetryStrategy } from "./RetryStrategy";

/**
 * Request Executor - Executes HTTP requests with timeout and retry logic
 */
export class RequestExecutor {
  /**
   * Execute HTTP request
   * @param {string} url - Full URL for the request
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  static async execute(url, options = {}) {
    const {
      method = "GET",
      data = null,
      headers = {},
      timeout = API_CONFIG.TIMEOUT,
      retry = API_CONFIG.RETRY_ATTEMPTS,
    } = options;

    const executeRequest = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        // Check if data is FormData to determine header type
        const isFormData = data instanceof FormData;

        const config = {
          method,
          headers: isFormData
            ? HeaderBuilder.buildForUpload()
            : HeaderBuilder.build(headers),
          signal: controller.signal,
        };

        if (data) {
          // If data is FormData, send it directly without JSON.stringify
          if (isFormData) {
            config.body = data;
          } else {
            config.body = JSON.stringify(data);
          }
        }

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Parse response
        const responseData = await this.parseResponse(response);

        // Handle errors
        if (!response.ok) {
          ErrorHandler.handle(responseData, response);
        }

        return responseData;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    // Execute with retry logic
    return RetryStrategy.execute(
      executeRequest,
      retry,
      (error) => !ErrorHandler.shouldNotRetry(error)
    );
  }

  /**
   * Parse response based on content type
   * @param {Response} response - Fetch response
   * @returns {Promise} Parsed response data
   */
  static async parseResponse(response) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }
}
