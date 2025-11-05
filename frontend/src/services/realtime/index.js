import websocketService from "../websocketService";
import { PusherRealtimeClient } from "./providers/pusher";

class RealtimeService {
  constructor() {
    this.provider = (
      import.meta.env.VITE_REALTIME_PROVIDER || "ws"
    ).toLowerCase();
    this.client =
      this.provider === "pusher"
        ? new PusherRealtimeClient()
        : websocketService;
  }

  connect(token, ctx = {}) {
    if (this.provider === "pusher") {
      this.client.connect(token, ctx);
    } else {
      this.client.connect(token);
    }
  }

  on(event, cb) {
    return this.client.on(event, cb);
  }

  send(type, payload) {
    // pusher is pub/sub only; join/leave are implicit via subscriptions
    if (this.provider === "pusher") return;
    this.client.send(type, payload);
  }

  disconnect() {
    this.client.disconnect();
  }

  isConnected() {
    return this.client.isConnected ? this.client.isConnected() : false;
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
