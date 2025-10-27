import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with default value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    expect(result.current[0]).toBe("defaultValue");
  });

  it("should initialize with value from localStorage if exists", () => {
    // Manually set value before hook renders
    window.localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    expect(result.current[0]).toBe("storedValue");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    act(() => {
      result.current[1]("newValue");
    });

    expect(result.current[0]).toBe("newValue");
    expect(localStorage.getItem("testKey")).toBe(JSON.stringify("newValue"));
  });

  it("should handle function updates", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should handle complex objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", { count: 0 })
    );

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(localStorage.getItem("testKey")).toBe(JSON.stringify({ count: 5 }));
  });

  it("should remove item when set to null", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    // Set a value first
    act(() => {
      result.current[1]("someValue");
    });

    expect(localStorage.getItem("testKey")).not.toBeNull();

    // Now set to null
    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem("testKey")).toBeNull();
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Save original setItem
    const originalSetItem = window.localStorage.setItem;

    // Mock setItem to throw an error
    window.localStorage.setItem = vi.fn(() => {
      throw new Error("Storage quota exceeded");
    });

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    act(() => {
      result.current[1]("newValue");
    });

    expect(consoleSpy).toHaveBeenCalled();

    // Restore
    window.localStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });
});
