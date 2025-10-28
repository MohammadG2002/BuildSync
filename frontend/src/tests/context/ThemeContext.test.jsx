import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider } from "../../context/ThemeContext";
import { useTheme } from "../../hooks/useTheme";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should provide theme context to children", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current).toHaveProperty("theme");
    expect(result.current).toHaveProperty("toggleTheme");
  });

  it("should initialize with light theme by default", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");
  });

  it("should initialize with dark theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme from light to dark", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should toggle theme from dark to light", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should persist theme to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should apply dark class to document element", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove dark class from document element", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
