/**
 * Get Tasks Controller
 * @desc    Get all tasks
 * @route   GET /api/tasks?project=projectId&workspace=workspaceId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";

export const getTasks = async (req, res) => {
  try {
    const { project, workspace, status, priority, assignedTo } = req.query;
    const userId = req.user._id;

    // Build base query (exclude archived tasks by default)
    const query = { isArchived: false };

    // If project is specified, check role & membership
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Determine workspace role
      const workspaceDoc = await Workspace.findById(projectDoc.workspace);
      if (!workspaceDoc) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }
      const role = workspaceDoc.getUserRole?.(userId) || null;

      // Check if user is a member of the project
      const isMember = projectDoc.members.some(
        (member) => member.user.toString() === userId.toString()
      );

      // Owners/Admins can view any project; others require membership
      if (!(role === "owner" || role === "admin" || isMember)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not a member of this project",
        });
      }

      query.project = project;
    } else if (workspace) {
      // If only workspace is specified, check workspace role & constrain
      const workspaceDoc = await Workspace.findById(workspace);
      if (!workspaceDoc) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      const role = workspaceDoc.getUserRole?.(userId) || null;
      const isWorkspaceMember = Boolean(role);

      if (!isWorkspaceMember) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not a member of this workspace",
        });
      }

      // Owners/Admins: can view all tasks in workspace
      if (role === "owner" || role === "admin") {
        query.workspace = workspace;
      } else {
        // Members/Viewers: only tasks for projects where user is a member
        const memberProjects = await Project.find({
          workspace,
          "members.user": userId,
        }).select("_id");
        const ids = memberProjects.map((p) => p._id);
        query.project = { $in: ids };
      }
    } else {
      // If neither project nor workspace specified, only show user's tasks
      query.$or = [{ assignedTo: userId }, { createdBy: userId }];
    }

    // Add additional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
      .populate({ path: "dependencies", select: "title status sequence" })
      .populate("comments.user", "name email avatar")
      .populate("attachments.uploadedBy", "name email avatar")
      .populate("testAttachments.uploadedBy", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};
