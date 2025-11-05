/**
 * Accept Contact Controller
 * @desc    Accept a pending contact request from a specific user
 * @route   POST /api/contacts/accept/:userId
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";
import { sendContactAcceptedNotification } from "../../services/notificationService/index.js";
import { sendNotificationToUser } from "../../websocket/index.js";

export const acceptContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const me = req.user._id.toString();
    const other = userId;
    const pair = [me, other].sort();

    const contact = await Contact.findOne({
      "users.0": pair[0],
      "users.1": pair[1],
    });
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact request not found" });
    }

    if (contact.status === "blocked") {
      return res
        .status(403)
        .json({ success: false, message: "Contact is blocked" });
    }

    if (contact.status === "accepted") {
      return res.status(200).json({
        success: true,
        message: "Already contacts",
        data: { contact },
      });
    }

    // Pending must be requested by the other user for me to accept
    if (contact.requestedBy.toString() !== other.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "No incoming request to accept" });
    }

    contact.status = "accepted";
    await contact.save();

    // Notify original requester that their request was accepted
    try {
      const notif = await sendContactAcceptedNotification({
        recipientId: other,
        senderId: req.user._id,
        senderName: req.user.name,
        contactId: contact._id,
      });
      console.log(
        "[contact_accepted] notifying",
        other?.toString?.() || other,
        "notif:",
        notif?._id?.toString?.() || notif?.id || "(no id)"
      );
      sendNotificationToUser(other, notif);
    } catch (e) {
      console.error("Failed to send contact accepted notification:", e);
    }

    return res
      .status(200)
      .json({ success: true, message: "Contact accepted", data: { contact } });
  } catch (error) {
    console.error("Accept contact error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to accept contact" });
  }
};
