/**
 * List Contacts Controller
 * @desc    List contacts for the current user (accepted by default)
 * @route   GET /api/contacts?status=accepted|pending|blocked&include=users
 * @access  Private
 */

import Contact from "../../models/Contact/index.js";

export const listContacts = async (req, res) => {
  try {
    const { status = "accepted" } = req.query;
    const me = req.user._id;

    const query = { users: me };
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ updatedAt: -1 })
      .populate("users", "name email avatar");

    // Map to include the counterpart user for convenience
    const normalized = contacts.map((c) => {
      const users = Array.isArray(c.users) ? c.users : [];
      const other = users.find((u) => u._id.toString() !== me.toString());
      return {
        id: c._id,
        status: c.status,
        requestedBy: c.requestedBy,
        blockedBy: c.blockedBy,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: other || null,
      };
    });

    return res.json({
      success: true,
      count: normalized.length,
      data: { contacts: normalized },
    });
  } catch (error) {
    console.error("List contacts error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch contacts" });
  }
};
