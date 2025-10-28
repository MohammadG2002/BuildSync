import * as authService from "../../services/authService";
import { DEMO_MODE, DEMO_USER, DemoModeHelper } from "./demoMode";

/**
 * Auth Handlers - Business logic for authentication operations
 */
export class AuthHandlers {
  /**
   * Check authentication status
   * @returns {Promise<Object|null>} User object or null
   */
  static async checkAuth() {
    if (DEMO_MODE) {
      // Demo mode: check for demo token
      const token = localStorage.getItem("token");
      if (DemoModeHelper.isDemoToken(token)) {
        return DEMO_USER;
      }
      return null;
    } else {
      // Production mode: call API
      const token = localStorage.getItem("token");
      if (token) {
        const response = await authService.getCurrentUser();
        // Backend returns: { success: true, data: { user: {...} } }
        return response.data.user;
      }
      return null;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} User and token data
   */
  static async login(credentials) {
    if (DEMO_MODE) {
      // Demo mode: accept any credentials
      return {
        user: DEMO_USER,
        token: DemoModeHelper.getDemoToken(),
        message: "Welcome to BuildSync Demo!",
      };
    } else {
      // Production mode: call API
      const response = await authService.login(credentials);
      // Backend returns: { success: true, data: { user: {...}, token: "..." } }
      return {
        user: response.data.user,
        token: response.data.token,
        message: "Welcome back!",
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} User and token data
   */
  static async register(userData) {
    if (DEMO_MODE) {
      // Demo mode: create mock user with provided data
      const demoUser = DemoModeHelper.createDemoUser(userData);
      return {
        user: demoUser,
        token: DemoModeHelper.getDemoToken(),
        message: "Welcome to BuildSync Demo!",
      };
    } else {
      // Production mode: call API
      const response = await authService.register(userData);
      // Backend returns: { success: true, data: { user: {...}, token: "..." } }
      return {
        user: response.data.user,
        token: response.data.token,
        message: "Account created successfully!",
      };
    }
  }
}
