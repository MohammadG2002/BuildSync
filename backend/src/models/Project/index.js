/**
 * Project Model
 */

import mongoose from "mongoose";
import { projectSchema } from "./projectSchema.js";
import { setupProjectIndexes } from "./projectIndexes.js";
import { setupProjectVirtuals } from "./projectVirtuals.js";

// Setup indexes
setupProjectIndexes(projectSchema);

// Setup virtuals
setupProjectVirtuals(projectSchema);

const Project = mongoose.model("Project", projectSchema);

export default Project;
