import TaskActivity from "../../models/TaskActivity/index.js";

export const getTaskActivity = async (req, res) => {
  try {
    const taskId = req.params.id;
    const items = await TaskActivity.find({ task: taskId })
      .sort({ createdAt: -1 })
      .populate("actor", "name email avatar");

    return res.json({ success: true, data: { items } });
  } catch (error) {
    console.error("Get task activity error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get activity" });
  }
};
