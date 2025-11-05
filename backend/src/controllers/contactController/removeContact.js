/**
 * Remove Contact Controller
 * @desc    Remove (or cancel) a contact relationship with a user
 * @route   DELETE /api/contacts/:userId
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";

export const removeContact = async (req, res) => {
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

    await contact.deleteOne();
    return res.json({ success: true, message: "Contact removed" });
  } catch (error) {
    console.error("Remove contact error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove contact" });
  }
};
