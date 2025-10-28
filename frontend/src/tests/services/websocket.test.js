import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ConnectionManager,
  ReconnectStrategy,
  EventEmitter,
} from "../../services/websocketModule";

describe("EventEmitter", () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it("should register event listener", () => {
    const callback = vi.fn();
    emitter.on("test", callback);

    emitter.emit("test", { data: "test-data" });
    expect(callback).toHaveBeenCalledWith({ data: "test-data" });
  });

  it("should support multiple listeners for same event", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    emitter.on("test", callback1);
    emitter.on("test", callback2);

    emitter.emit("test", "data");
    expect(callback1).toHaveBeenCalledWith("data");
    expect(callback2).toHaveBeenCalledWith("data");
  });

  it("should remove event listener using return value", () => {
    const callback = vi.fn();
    const unsubscribe = emitter.on("test", callback);
    unsubscribe();

    emitter.emit("test", "data");
    expect(callback).not.toHaveBeenCalled();
  });

  it("should clear all listeners when removeAllListeners called", () => {
    const callback = vi.fn();
    emitter.on("test", callback);
    emitter.removeAllListeners("test");

    emitter.emit("test", "data");
    expect(callback).not.toHaveBeenCalled();
  });

  it("should clear all listeners", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    emitter.on("event1", callback1);
    emitter.on("event2", callback2);
    emitter.clear();

    emitter.emit("event1", "data");
    emitter.emit("event2", "data");

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it("should not throw when emitting event with no listeners", () => {
    expect(() => emitter.emit("nonexistent", "data")).not.toThrow();
  });
});

describe("ReconnectStrategy", () => {
  let strategy;

  beforeEach(() => {
    strategy = new ReconnectStrategy();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with zero attempts", () => {
    expect(strategy.getAttempts()).toBe(0);
  });

  it("should reset attempts", () => {
    strategy.reconnectAttempts = 5;
    strategy.reset();
    expect(strategy.getAttempts()).toBe(0);
  });

  it("should attempt reconnect with exponential backoff", () => {
    const connectFn = vi.fn();
    const token = "test-token";

    strategy.attemptReconnect(token, connectFn);

    expect(connectFn).not.toHaveBeenCalled();
    expect(strategy.getAttempts()).toBe(1);
  });

  it("should stop reconnecting after max attempts", () => {
    const connectFn = vi.fn();
    const onMaxAttempts = vi.fn();
    const token = "test-token";

    strategy.reconnectAttempts = 5;
    strategy.attemptReconnect(token, connectFn, onMaxAttempts);

    expect(connectFn).not.toHaveBeenCalled();
    expect(onMaxAttempts).toHaveBeenCalled();
  });
});
describe("ConnectionManager", () => {
  let manager;

  beforeEach(() => {
    // Mock WebSocket constructor
    global.WebSocket = vi.fn().mockImplementation(() => ({
      readyState: WebSocket.CONNECTING,
      close: vi.fn(),
      send: vi.fn(),
    }));

    // Define WebSocket constants
    global.WebSocket.OPEN = 1;
    global.WebSocket.CLOSED = 3;
    global.WebSocket.CONNECTING = 0;

    manager = new ConnectionManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a ConnectionManager instance", () => {
    expect(manager).toBeInstanceOf(ConnectionManager);
    expect(manager.ws).toBeNull();
  });

  it("should have send method", () => {
    expect(typeof manager.send).toBe("function");
  });

  it("should have disconnect method", () => {
    expect(typeof manager.disconnect).toBe("function");
  });

  it("should have buildWebSocketUrl method", () => {
    const url = manager.buildWebSocketUrl();
    expect(typeof url).toBe("string");
    expect(url).toContain("ws");
  });
});
