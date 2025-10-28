/**
 * Delete Task Controller
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only task creator can delete task",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
