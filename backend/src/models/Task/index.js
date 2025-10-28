/**
 * Task Model
 */

import mongoose from "mongoose";
import { taskSchema } from "./taskSchema.js";
import { setupTaskIndexes } from "./taskIndexes.js";
import { setupTaskHooks } from "./taskHooks.js";

// Setup indexes
setupTaskIndexes(taskSchema);

// Setup hooks
setupTaskHooks(taskSchema);

const Task = mongoose.model("Task", taskSchema);

export default Task;
