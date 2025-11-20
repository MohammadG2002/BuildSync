import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";
import Task from "../../models/Task/index.js";
import { ensureExistingTags } from "../../utils/tags/validateTags.js";

/**
 * Execute an AI command object.
 * Supported:
 *  - { action: 'create_project', name }
 *  - { action: 'create_task', workspaceId, projectId?, title, description?, tags? }
 * Role constraints:
 *  - create_project requires user.role === 'admin'
 *  - create_task requires workspace membership and not viewer.
 * @param {Object} cmd Parsed JSON command
 * @param {Object} user Authenticated user document
 * @returns {Object|null} action result descriptor
 */
export const executeAICommand = async (cmd, user) => {
  if (!user || !cmd || typeof cmd !== "object") return null;

  switch (cmd.action) {
    case "create_project": {
      if (user.role !== "admin") {
        return {
          type: "create_project",
          status: "forbidden",
          reason: "Insufficient role",
        };
      }
      const name = (cmd.name || "Untitled Project").slice(0, 120);
      try {
        const project = await Project.create({
          name,
          createdBy: user._id,
          members: [user._id],
        });
        return {
          type: "create_project",
          status: "success",
          projectId: project._id,
          name: project.name,
        };
      } catch (e) {
        return { type: "create_project", status: "error", message: e.message };
      }
    }
    case "create_task": {
      const workspaceId = cmd.workspaceId;
      const projectId = cmd.projectId || null;
      const title = (cmd.title || "Untitled Task").slice(0, 200);
      const description = (cmd.description || "").slice(0, 2000);
      if (!workspaceId) {
        return {
          type: "create_task",
          status: "error",
          message: "workspaceId required",
        };
      }
      try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace)
          return {
            type: "create_task",
            status: "error",
            message: "Workspace not found",
          };
        if (!workspace.isMember(user._id))
          return {
            type: "create_task",
            status: "forbidden",
            reason: "Not a member",
          };
        const roleInWorkspace = workspace.getUserRole(user._id);
        if (roleInWorkspace === "viewer")
          return {
            type: "create_task",
            status: "forbidden",
            reason: "Viewer cannot create",
          };

        let project = null;
        if (projectId) {
          project = await Project.findById(projectId);
          if (!project)
            return {
              type: "create_task",
              status: "error",
              message: "Project not found",
            };
        }

        const normalizedTags = await ensureExistingTags(
          workspaceId,
          Array.isArray(cmd.tags) ? cmd.tags : []
        );

        // Increment project taskCounter if project provided
        let sequence = null;
        if (project) {
          const updatedProject = await Project.findByIdAndUpdate(
            project._id,
            { $inc: { taskCounter: 1 } },
            { new: true }
          );
          sequence = updatedProject.taskCounter;
        }

        const task = await Task.create({
          title,
          description,
          project: projectId,
          workspace: workspaceId,
          createdBy: user._id,
          status: "todo",
          priority: "medium",
          startDate: new Date(),
          tags: normalizedTags,
          sequence,
        });
        return {
          type: "create_task",
          status: "success",
          taskId: task._id,
          title: task.title,
        };
      } catch (e) {
        return { type: "create_task", status: "error", message: e.message };
      }
    }
    default:
      return null;
  }
};

export default executeAICommand;
