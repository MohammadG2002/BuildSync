/**
 * Workspace Model
 */

import mongoose from "mongoose";
import { workspaceSchema } from "./workspaceSchema.js";
import { setupWorkspaceIndexes } from "./workspaceIndexes.js";
import { setupWorkspaceVirtuals } from "./workspaceVirtuals.js";
import { setupWorkspaceMethods } from "./workspaceMethods.js";

// Setup indexes
setupWorkspaceIndexes(workspaceSchema);

// Setup virtuals
setupWorkspaceVirtuals(workspaceSchema);

// Setup methods
setupWorkspaceMethods(workspaceSchema);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
