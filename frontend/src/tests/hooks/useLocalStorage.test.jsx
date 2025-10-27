import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    expect(result.current[0]).toBe("defaultValue");
  });

  it("should initialize with value from localStorage if exists", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue")
    );

    expect(result.current[0]).toBe("storedValue");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify("updated")
    );
  });

  it("should handle function updates", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should handle complex objects", () => {
    const complexObject = { name: "Test", items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage("testKey", null));

    act(() => {
      result.current[1](complexObject);
    });

    expect(result.current[0]).toEqual(complexObject);
  });

  it("should remove item when set to null", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "value"));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith("testKey");
  });

  it("should handle localStorage errors gracefully", () => {
    // Simulate localStorage error
    localStorage.setItem.mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });

    const { result } = renderHook(() => useLocalStorage("testKey", "value"));

    // Should not crash
    act(() => {
      result.current[1]("newValue");
    });

    expect(result.current[0]).toBe("newValue");
  });
});
