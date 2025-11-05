/**
 * Request Contact Controller
 * @desc    Create or accept a contact request by userId or email
 * @routes  POST /api/contacts/request/:userId
 *          POST /api/contacts/request  body: { email }
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";
import User from "../../models/User/index.js";
import {
  sendContactRequestNotification,
  sendContactAcceptedNotification,
} from "../../services/notificationService/index.js";
import { sendNotificationToUser } from "../../websocket/index.js";

const findOrCreatePair = async (userIdA, userIdB) => {
  const pair = [userIdA.toString(), userIdB.toString()].sort();
  let contact = await Contact.findOne({
    "users.0": pair[0],
    "users.1": pair[1],
  });
  return { contact, pair };
};

export const requestContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body || {};

    let otherUser = null;
    if (userId) {
      otherUser = await User.findById(userId).select("name email avatar");
    } else if (email) {
      otherUser = await User.findOne({
        email: email.trim().toLowerCase(),
      }).select("name email avatar");
    } else {
      return res.status(400).json({
        success: false,
        message: "Provide userId param or email in body",
      });
    }

    if (!otherUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (otherUser._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot add yourself as a contact" });
    }

    const { contact, pair } = await findOrCreatePair(
      req.user._id,
      otherUser._id
    );

    if (contact) {
      // Existing relationship
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
      // Pending: if the other user requested before, auto-accept; otherwise keep pending
      const requestedByStr = contact.requestedBy.toString();
      if (requestedByStr !== req.user._id.toString()) {
        // Other user requested; accept now
        contact.status = "accepted";
        await contact.save();
        // Notify original requester that their request was accepted
        try {
          const notif = await sendContactAcceptedNotification({
            recipientId: contact.requestedBy,
            senderId: req.user._id,
            senderName: req.user.name,
            contactId: contact._id,
          });
          console.log(
            "[contact_accepted] notifying",
            contact.requestedBy?.toString?.() || contact.requestedBy,
            "notif:",
            notif?._id?.toString?.() || notif?.id || "(no id)"
          );
          sendNotificationToUser(contact.requestedBy, notif);
        } catch (e) {
          console.error("Failed to send contact accepted notification:", e);
        }
        return res.status(200).json({
          success: true,
          message: "Contact accepted",
          data: { contact },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Request already sent",
        data: { contact },
      });
    }

    // Create pending request
    const created = await Contact.create({
      users: pair,
      requestedBy: req.user._id,
      status: "pending",
    });
    // Notify the other user of a new contact request
    try {
      const notif = await sendContactRequestNotification({
        recipientId: otherUser._id,
        senderId: req.user._id,
        senderName: req.user.name,
        contactId: created._id,
      });
      console.log(
        "[contact_request] notifying",
        otherUser._id?.toString?.() || otherUser._id,
        "notif:",
        notif?._id?.toString?.() || notif?.id || "(no id)"
      );
      sendNotificationToUser(otherUser._id, notif);
    } catch (e) {
      console.error("Failed to send contact request notification:", e);
    }
    return res.status(201).json({
      success: true,
      message: "Contact request sent",
      data: { contact: created },
    });
  } catch (error) {
    console.error("Request contact error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send contact request" });
  }
};
