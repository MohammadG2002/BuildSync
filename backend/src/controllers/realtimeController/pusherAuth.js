/**
 * Pusher Auth Controller
 * Signs private and presence channel subscriptions.
 * Route: POST /api/realtime/pusher/auth
 */

import Pusher from "pusher";
import Workspace from "../../models/Workspace/index.js";

const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
  process.env;

let pusher = null;
if (PUSHER_APP_ID && PUSHER_KEY && PUSHER_SECRET && PUSHER_CLUSTER) {
  pusher = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
}

export const pusherAuth = async (req, res) => {
  try {
    if (!pusher) {
      return res
        .status(501)
        .json({ success: false, message: "Pusher is not configured" });
    }

    const { socket_id, channel_name } = req.body || {};
    if (!socket_id || !channel_name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "socket_id and channel_name required",
        });
    }

    // private-user-{userId}
    if (channel_name.startsWith("private-user-")) {
      const targetUserId = channel_name.replace("private-user-", "");
      if (targetUserId !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const auth = pusher.authenticate(socket_id, channel_name);
      return res.status(200).send(auth);
    }

    // presence-workspace-{workspaceId}
    if (channel_name.startsWith("presence-workspace-")) {
      const workspaceId = channel_name.replace("presence-workspace-", "");
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace || !workspace.isMember(req.user._id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const presenceData = {
        user_id: req.user._id.toString(),
        user_info: {
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
        },
      };
      const auth = pusher.authenticate(socket_id, channel_name, presenceData);
      return res.status(200).send(auth);
    }

    return res.status(400).json({ success: false, message: "Unknown channel" });
  } catch (error) {
    console.error("Pusher auth error:", error);
    res.status(500).json({ success: false, message: "Auth failed" });
  }
};
