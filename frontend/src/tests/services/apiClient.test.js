import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  TokenManager,
  HeaderBuilder,
  ErrorHandler,
  RetryStrategy,
  RequestExecutor,
} from "../../services/apiClientModule";

describe("TokenManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should get token from localStorage", () => {
    localStorage.setItem("token", "test-token-123");
    expect(TokenManager.getToken()).toBe("test-token-123");
  });

  it("should return null when no token exists", () => {
    expect(TokenManager.getToken()).toBeNull();
  });

  it("should set token in localStorage", () => {
    TokenManager.setToken("new-token-456");
    expect(localStorage.getItem("token")).toBe("new-token-456");
  });

  it("should clear token from localStorage", () => {
    localStorage.setItem("token", "token-to-clear");
    TokenManager.removeToken();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should clear all auth data", () => {
    localStorage.setItem("token", "auth-token");
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test" }));

    TokenManager.clearAuthData();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});

describe("HeaderBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should build headers without token", () => {
    const headers = HeaderBuilder.build();
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Authorization).toBeUndefined();
  });

  it("should build headers with token", () => {
    localStorage.setItem("token", "auth-token-789");
    const headers = HeaderBuilder.build();
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Authorization).toBe("Bearer auth-token-789");
  });

  it("should allow custom headers", () => {
    const customHeaders = { "X-Custom-Header": "custom-value" };
    const headers = HeaderBuilder.build(customHeaders);
    expect(headers["X-Custom-Header"]).toBe("custom-value");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("should allow overriding Content-Type", () => {
    const headers = HeaderBuilder.build({ "Content-Type": "text/plain" });
    expect(headers["Content-Type"]).toBe("text/plain");
  });
});

describe("ErrorHandler", () => {
  it("should handle 401 Unauthorized", () => {
    const error = { message: "Unauthorized" };
    const response = { status: 401 };

    expect(() => ErrorHandler.handle(error, response)).toThrow();
  });

  it("should handle 403 Forbidden", () => {
    const error = { message: "Forbidden" };
    const response = { status: 403 };

    expect(() => ErrorHandler.handle(error, response)).toThrow("Forbidden");
  });

  it("should handle 404 Not Found", () => {
    const error = { message: "Not Found" };
    const response = { status: 404 };

    expect(() => ErrorHandler.handle(error, response)).toThrow("Not Found");
  });

  it("should handle 500 Server Error", () => {
    const error = { message: "Internal Server Error" };
    const response = { status: 500 };

    expect(() => ErrorHandler.handle(error, response)).toThrow(
      "Internal Server Error"
    );
  });

  it("should handle network errors", () => {
    const error = { message: "Network Error" };

    expect(() => ErrorHandler.handle(error, null)).toThrow();
  });

  it("should format validation errors", () => {
    const error = {
      message: "Validation failed",
      errors: [
        { message: "Email is required" },
        { message: "Password is too short" },
      ],
    };
    const response = { status: 400 };

    expect(() => ErrorHandler.handle(error, response)).toThrow();
  });
});

describe("RetryStrategy", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute function successfully on first try", async () => {
    const fn = vi.fn().mockResolvedValue({ data: "success" });

    const result = await RetryStrategy.execute(fn, 3);

    expect(result.data).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and succeed", async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 2) {
        return Promise.reject(new Error("Server Error"));
      }
      return Promise.resolve({ data: "success" });
    });

    const promise = RetryStrategy.execute(fn, 3);

    await vi.runAllTimersAsync();

    const result = await promise;
    expect(result.data).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("RequestExecutor", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute GET request successfully", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ data: "test" }),
    });

    const result = await RequestExecutor.execute(
      "http://localhost:3000/api/test",
      {
        method: "GET",
      }
    );

    expect(result.data).toBe("test");
    expect(global.fetch).toHaveBeenCalled();
  });
});
