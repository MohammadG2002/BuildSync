import mongoose from "mongoose";
import { taskActivitySchema } from "./taskActivitySchema.js";

const TaskActivity =
  mongoose.models.TaskActivity ||
  mongoose.model("TaskActivity", taskActivitySchema);

export default TaskActivity;
