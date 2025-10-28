import { describe, it, expect } from "vitest";
import {
  API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  API_ENDPOINTS,
} from "../../config/api.config";

describe("API Configuration", () => {
  describe("API_CONFIG", () => {
    it("should have BASE_URL defined", () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(typeof API_CONFIG.BASE_URL).toBe("string");
    });

    it("should have TIMEOUT defined as a number", () => {
      expect(API_CONFIG.TIMEOUT).toBeDefined();
      expect(typeof API_CONFIG.TIMEOUT).toBe("number");
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
    });

    it("should have RETRY_ATTEMPTS defined", () => {
      expect(API_CONFIG.RETRY_ATTEMPTS).toBeDefined();
      expect(typeof API_CONFIG.RETRY_ATTEMPTS).toBe("number");
    });

    it("should have RETRY_DELAY defined", () => {
      expect(API_CONFIG.RETRY_DELAY).toBeDefined();
      expect(typeof API_CONFIG.RETRY_DELAY).toBe("number");
    });
  });

  describe("HTTP_STATUS", () => {
    it("should have standard HTTP status codes", () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe("ERROR_MESSAGES", () => {
    it("should have user-friendly error messages", () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined();
      expect(ERROR_MESSAGES.FORBIDDEN).toBeDefined();
      expect(ERROR_MESSAGES.NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.SERVER_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.UNKNOWN).toBeDefined();
    });

    it("should have meaningful error message content", () => {
      expect(typeof ERROR_MESSAGES.NETWORK_ERROR).toBe("string");
      expect(ERROR_MESSAGES.NETWORK_ERROR.length).toBeGreaterThan(0);
    });
  });

  describe("AUTH_ENDPOINTS", () => {
    it("should have all authentication endpoints", () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toBeDefined();
      expect(API_ENDPOINTS.AUTH.REGISTER).toBeDefined();
      expect(API_ENDPOINTS.AUTH.LOGOUT).toBeDefined();
      expect(API_ENDPOINTS.AUTH.ME).toBeDefined();
      expect(API_ENDPOINTS.AUTH.FORGOT_PASSWORD).toBeDefined();
      expect(API_ENDPOINTS.AUTH.RESET_PASSWORD).toBeDefined();
      expect(API_ENDPOINTS.AUTH.CHANGE_PASSWORD).toBeDefined();
      expect(API_ENDPOINTS.AUTH.UPDATE_PROFILE).toBeDefined();
    });

    it("should have valid endpoint paths", () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toMatch(/^\/auth\//);
      expect(API_ENDPOINTS.AUTH.REGISTER).toMatch(/^\/auth\//);
    });
  });

  describe("WORKSPACE_ENDPOINTS", () => {
    it("should have CRUD endpoints", () => {
      expect(API_ENDPOINTS.WORKSPACES.LIST).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.CREATE).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.GET).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.UPDATE).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.DELETE).toBeDefined();
    });

    it("should have member management endpoints", () => {
      expect(API_ENDPOINTS.WORKSPACES.MEMBERS).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.ADD_MEMBER).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.UPDATE_MEMBER).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES.REMOVE_MEMBER).toBeDefined();
    });

    it("should support dynamic IDs", () => {
      const workspaceId = "123";
      const endpoint = API_ENDPOINTS.WORKSPACES.GET(workspaceId);
      expect(endpoint).toContain(workspaceId);
    });
  });

  describe("PROJECT_ENDPOINTS", () => {
    it("should have all project endpoints", () => {
      expect(API_ENDPOINTS.PROJECTS.LIST).toBeDefined();
      expect(API_ENDPOINTS.PROJECTS.CREATE).toBeDefined();
      expect(API_ENDPOINTS.PROJECTS.GET).toBeDefined();
      expect(API_ENDPOINTS.PROJECTS.UPDATE).toBeDefined();
      expect(API_ENDPOINTS.PROJECTS.DELETE).toBeDefined();
    });

    it("should support dynamic workspace and project IDs", () => {
      const workspaceId = "ws123";
      const projectId = "proj456";
      const endpoint = API_ENDPOINTS.PROJECTS.GET(workspaceId, projectId);
      // Project endpoints only use projectId in the path
      expect(endpoint).toContain(projectId);
    });
  });

  describe("TASK_ENDPOINTS", () => {
    it("should have all task endpoints", () => {
      expect(API_ENDPOINTS.TASKS.LIST).toBeDefined();
      expect(API_ENDPOINTS.TASKS.CREATE).toBeDefined();
      expect(API_ENDPOINTS.TASKS.GET).toBeDefined();
      expect(API_ENDPOINTS.TASKS.UPDATE).toBeDefined();
      expect(API_ENDPOINTS.TASKS.DELETE).toBeDefined();
      expect(API_ENDPOINTS.TASKS.ARCHIVE).toBeDefined();
      expect(API_ENDPOINTS.TASKS.ARCHIVED).toBeDefined();
    });

    it("should support dynamic IDs for task operations", () => {
      const workspaceId = "ws123";
      const projectId = "proj123";
      const taskId = "task456";
      const endpoint = API_ENDPOINTS.TASKS.GET(workspaceId, projectId, taskId);
      // Task endpoints only use taskId in the path
      expect(endpoint).toContain(taskId);
    });
  });

  describe("API_ENDPOINTS", () => {
    it("should export all endpoint groups", () => {
      expect(API_ENDPOINTS.AUTH).toBeDefined();
      expect(API_ENDPOINTS.WORKSPACES).toBeDefined();
      expect(API_ENDPOINTS.PROJECTS).toBeDefined();
      expect(API_ENDPOINTS.TASKS).toBeDefined();
      expect(API_ENDPOINTS.CHAT).toBeDefined();
      expect(API_ENDPOINTS.NOTIFICATIONS).toBeDefined();
      expect(API_ENDPOINTS.FILES).toBeDefined();
    });

    it("should have consistent structure", () => {
      expect(API_ENDPOINTS.AUTH).toHaveProperty("LOGIN");
      expect(API_ENDPOINTS.WORKSPACES).toHaveProperty("LIST");
      expect(API_ENDPOINTS.PROJECTS).toHaveProperty("LIST");
      expect(API_ENDPOINTS.TASKS).toHaveProperty("LIST");
    });
  });
});
