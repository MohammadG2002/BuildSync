/**
 * Main Validations Barrel Export
 *
 * Re-exports all validation modules from their respective categories
 */

// Validation handler
export { validate } from "./validate.js";

// Auth validations
export {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
} from "./auth/index.js";

// Workspace validations
export {
  createWorkspaceValidation,
  updateWorkspaceValidation,
  addWorkspaceMemberValidation,
  workspaceValidation,
} from "./workspace/index.js";

// Project validations
export {
  createProjectValidation,
  updateProjectValidation,
  addProjectMemberValidation,
  projectValidation,
} from "./project/index.js";

// Task validations
export {
  createTaskValidation,
  updateTaskValidation,
  addTaskCommentValidation,
  taskValidation,
  taskCreateValidation,
} from "./task/index.js";

// Common validations
export {
  mongoIdValidation,
  paginationValidation,
  searchValidation,
} from "./common/index.js";
