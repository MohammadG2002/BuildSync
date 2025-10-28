import { TokenManager } from "./TokenManager";

/**
 * Header Builder - Constructs request headers with authentication
 */
export class HeaderBuilder {
  /**
   * Build request headers with optional custom headers
   * @param {Object} customHeaders - Custom headers to include
   * @returns {Object} Complete headers object
   */
  static build(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = TokenManager.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build headers for multipart form data
   * @returns {Object} Headers for file upload
   */
  static buildForUpload() {
    const headers = {};
    const token = TokenManager.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }
}
