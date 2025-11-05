/**
 * Pusher Realtime Service (optional)
 * Provides cloud messaging via Pusher Channels when configured.
 */

import Pusher from "pusher";

const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
  process.env;

let pusherClient = null;

export const pusherEnabled =
  !!PUSHER_APP_ID && !!PUSHER_KEY && !!PUSHER_SECRET && !!PUSHER_CLUSTER;

if (pusherEnabled) {
  pusherClient = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
}

/**
 * Publish an event to a user-specific private channel
 * Channel: private-user-{userId}
 */
export const publishToUser = async (userId, event, payload) => {
  if (!pusherEnabled || !pusherClient) return;
  const channel = `private-user-${userId}`;
  try {
    await pusherClient.trigger(channel, event, payload);
  } catch (e) {
    console.error("Pusher publishToUser error:", e);
  }
};

/**
 * Publish an event to a workspace presence channel
 * Channel: presence-workspace-{workspaceId}
 */
export const publishToWorkspace = async (workspaceId, event, payload) => {
  if (!pusherEnabled || !pusherClient) return;
  const channel = `presence-workspace-${workspaceId}`;
  try {
    await pusherClient.trigger(channel, event, payload);
  } catch (e) {
    console.error("Pusher publishToWorkspace error:", e);
  }
};
