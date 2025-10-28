/**
 * Demo Mode Configuration and Mock Data
 */

// Demo mode flag - set to false to connect to real backend
export const DEMO_MODE = false;

// Mock user data for demo
export const DEMO_USER = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@buildsync.com",
  avatar: null,
  role: "owner",
  createdAt: new Date().toISOString(),
};

/**
 * Demo Mode Helpers
 */
export class DemoModeHelper {
  /**
   * Create demo user from registration data
   * @param {Object} userData - User registration data
   * @returns {Object} Demo user object
   */
  static createDemoUser(userData) {
    return {
      id: "demo-user-" + Date.now(),
      name: userData.name,
      email: userData.email,
      avatar: null,
      role: "owner",
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Check if token is demo token
   * @param {string} token - Token to check
   * @returns {boolean} True if demo token
   */
  static isDemoToken(token) {
    return token === "demo-token";
  }

  /**
   * Get demo token
   * @returns {string} Demo token
   */
  static getDemoToken() {
    return "demo-token";
  }
}
