import {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from "../config/api.config";
import { RequestExecutor, FileUploader } from "./apiClientModule";

/**
 * API Client with request/response interceptors
 */
class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request with timeout and retry logic
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    return RequestExecutor.execute(url, {
      ...options,
      timeout: this.timeout,
    });
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
    return FileUploader.upload(url, formData, onProgress, this.timeout);
  }
}

// Export singleton instance
const apiClient = new APIClient();

export default apiClient;
export { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES };
