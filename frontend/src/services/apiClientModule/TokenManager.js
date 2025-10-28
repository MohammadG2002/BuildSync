/**
 * Token Manager - Handles authentication token storage and retrieval
 */
export class TokenManager {
  /**
   * Get auth token from localStorage
   */
  static getToken() {
    return localStorage.getItem("token");
  }

  /**
   * Set auth token in localStorage
   */
  static setToken(token) {
    localStorage.setItem("token", token);
  }

  /**
   * Remove auth token from localStorage
   */
  static removeToken() {
    localStorage.removeItem("token");
  }

  /**
   * Clear all auth data
   */
  static clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
