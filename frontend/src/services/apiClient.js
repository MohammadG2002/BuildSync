import {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from "../config/api.config";

/**
 * API Client with request/response interceptors
 */
class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get auth token from localStorage
   */
  getToken() {
    return localStorage.getItem("token");
  }

  /**
   * Build request headers
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  handleError(error, response) {
    // Network error
    if (!response) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    // Handle specific HTTP status codes
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Clear auth data and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      case HTTP_STATUS.FORBIDDEN:
        throw new Error(ERROR_MESSAGES.FORBIDDEN);

      case HTTP_STATUS.NOT_FOUND:
        throw new Error(ERROR_MESSAGES.NOT_FOUND);

      case HTTP_STATUS.VALIDATION_ERROR:
        throw new Error(error.message || ERROR_MESSAGES.VALIDATION_ERROR);

      case HTTP_STATUS.SERVER_ERROR:
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);

      default:
        throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
    }
  }

  /**
   * Make HTTP request with timeout and retry logic
   */
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      data = null,
      headers = {},
      retry = API_CONFIG.RETRY_ATTEMPTS,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config = {
      method,
      headers: this.getHeaders(headers),
      signal: controller.signal,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    let lastError;

    // Retry logic
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Parse response
        const contentType = response.headers.get("content-type");
        const responseData =
          contentType && contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        // Handle errors
        if (!response.ok) {
          this.handleError(responseData, response);
        }

        return responseData;
      } catch (error) {
        lastError = error;

        // Don't retry on auth errors or client errors
        if (
          error.message === ERROR_MESSAGES.UNAUTHORIZED ||
          error.message === ERROR_MESSAGES.FORBIDDEN
        ) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retry) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError || new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", data });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", data });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", data });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Upload file
   */
  async upload(endpoint, formData, onProgress) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timeout"));
      });

      xhr.open("POST", url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.timeout = this.timeout;
      xhr.send(formData);
    });
  }
}

// Export singleton instance
const apiClient = new APIClient();

export default apiClient;
export { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES };
