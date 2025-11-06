/**
 * Block Contact Controller
 * @desc    Block a contact (prevents both users from DMing)
 * @route   POST /api/contacts/block/:userId
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";

export const blockContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const me = req.user._id.toString();
    const other = userId;
    const pair = [me, other].sort();

    let contact = await Contact.findOne({
      "users.0": pair[0],
      "users.1": pair[1],
    });

    if (!contact) {
      contact = await Contact.create({
        users: pair,
        requestedBy: req.user._id,
        status: "blocked",
        blockedBy: req.user._id,
      });
      return res.status(201).json({
        success: true,
        message: "Contact blocked",
        data: { contact },
      });
    }

    if (contact.status === "blocked") {
      return res.json({
        success: true,
        message: "Already blocked",
        data: { contact },
      });
    }

    contact.status = "blocked";
    contact.blockedBy = req.user._id;
    await contact.save();

    return res.json({
      success: true,
      message: "Contact blocked",
      data: { contact },
    });
  } catch (error) {
    console.error("Block contact error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to block contact" });
  }
};
