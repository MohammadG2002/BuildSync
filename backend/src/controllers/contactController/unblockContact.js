/**
 * Unblock Contact Controller
 * @desc    Unblock a contact (reverts to accepted contact)
 * @route   POST /api/contacts/unblock/:userId
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";

export const unblockContact = async (req, res) => {
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
        .json({ success: false, message: "Contact not found" });
    }

    if (contact.status !== "blocked") {
      return res.status(400).json({
        success: false,
        message: "Contact is not blocked",
      });
    }

    if (contact.blockedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You did not block this contact",
      });
    }

    contact.status = "accepted";
    contact.blockedBy = null;
    await contact.save();

    return res.json({
      success: true,
      message: "Contact unblocked",
      data: { contact },
    });
  } catch (error) {
    console.error("Unblock contact error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to unblock contact" });
  }
};
