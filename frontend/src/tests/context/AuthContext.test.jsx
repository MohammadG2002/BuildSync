import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { MemoryRouter } from "react-router-dom";

// Mock API calls
vi.mock("../../services/authService", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Wrapper component that provides both Router and Auth context
const createWrapper = () => {
  return ({ children }) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should provide auth context to children", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("register");
      expect(result.current).toHaveProperty("loading");
    });

    it("should initialize with no user when not authenticated", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("should have proper function signatures", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
      expect(typeof result.current.register).toBe("function");
    });
  });
});
