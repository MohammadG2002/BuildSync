/**
 * Project Model Virtuals
 */

import mongoose from "mongoose";

export const setupProjectVirtuals = (schema) => {
  // Virtual for tasks
  schema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "project",
  });

  // Calculate progress based on completed tasks
  schema.virtual("progress").get(async function () {
    const Task = mongoose.model("Task");
    const totalTasks = await Task.countDocuments({ project: this._id });
    const completedTasks = await Task.countDocuments({
      project: this._id,
      status: "completed",
    });
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  });
};
