/**
 * Search Users Controller
 * @desc    Search users (for inviting to workspace/project)
 * @route   GET /api/members/search?q=query
 * @access  Private
 */

import User from "../../models/User/index.js";

export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user._id }, // Exclude current user
      isActive: true,
    })
      .select("name email avatar")
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};
