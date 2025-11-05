import Pusher from "pusher-js";
import { API_CONFIG } from "../../../config/api.config";
import { EventEmitter } from "../../websocketModule/EventEmitter";

// Ensure TLS
Pusher.logToConsole = false;

export class PusherRealtimeClient {
  constructor() {
    this.pusher = null;
    this.channels = {};
    this.eventEmitter = new EventEmitter();
  }

  on(event, cb) {
    return this.eventEmitter.on(event, cb);
  }

  connect(token, { workspaceId, userId }) {
    const key = import.meta.env.VITE_PUSHER_KEY;
    const cluster = import.meta.env.VITE_PUSHER_CLUSTER;
    if (!key || !cluster) {
      console.warn("Pusher keys not configured; realtime (pusher) disabled");
      return;
    }

    // Set up custom authorizer to pass bearer token
    this.pusher = new Pusher(key, {
      cluster,
      authEndpoint: `${API_CONFIG.BASE_URL.replace(
        /\/$/,
        ""
      )}/realtime/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    });

    this.pusher.connection.bind("connected", () => {
      this.eventEmitter.emit("connected");
    });
    this.pusher.connection.bind("disconnected", () => {
      this.eventEmitter.emit("disconnected");
    });
    this.pusher.connection.bind("error", (err) => {
      this.eventEmitter.emit("error", err);
    });

    // Subscribe to user private channel for DMs/notifications
    if (userId) {
      const userChannel = this.pusher.subscribe(`private-user-${userId}`);
      this.channels.user = userChannel;
      userChannel.bind("dm_message", (data) => {
        this.eventEmitter.emit("dm_message", data);
      });
      userChannel.bind("notification", (data) => {
        this.eventEmitter.emit("notification", data);
      });
    }

    // Subscribe to workspace presence channel for workspace chat events
    if (workspaceId) {
      const wsChannel = this.pusher.subscribe(
        `presence-workspace-${workspaceId}`
      );
      this.channels.workspace = wsChannel;
      wsChannel.bind("new_message", (data) => {
        this.eventEmitter.emit("new_message", data);
      });
    }
  }

  // No-ops for pusher provider
  send() {}

  disconnect() {
    try {
      Object.values(this.channels).forEach((ch) => ch && ch.unbind_all());
      this.channels = {};
      if (this.pusher) {
        this.pusher.disconnect();
      }
    } catch (e) {
      // ignore
    }
  }
}
