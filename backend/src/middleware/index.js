/**
 * Middleware Barrel Export
 * Centralized export for all middleware modules
 */

// Authentication & Authorization
export {
  authenticate,
  isAdmin,
  checkWorkspaceMembership,
} from "./auth/index.js";

// Validation
export {
  validate,
  // Auth validations
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
  // Workspace validations
  createWorkspaceValidation,
  updateWorkspaceValidation,
  addWorkspaceMemberValidation,
  workspaceValidation,
  // Project validations
  createProjectValidation,
  updateProjectValidation,
  addProjectMemberValidation,
  projectValidation,
  // Task validations
  createTaskValidation,
  updateTaskValidation,
  addTaskCommentValidation,
  taskValidation,
  taskCreateValidation,
  // Common validations
  mongoIdValidation,
  paginationValidation,
  searchValidation,
  // Tag validations
  createTagValidation,
  updateTagValidation,
} from "./validations/index.js";

// Error Handling
export { errorHandler } from "./errorHandler.js";
export { notFound } from "./notFound.js";

// Rate Limiting
export { rateLimiter, authRateLimiter } from "./rateLimiter/index.js";
