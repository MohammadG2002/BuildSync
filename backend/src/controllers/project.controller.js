import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import Task from "../models/Task.js";

// @desc    Get all projects in workspace
// @route   GET /api/projects?workspace=workspaceId
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const { workspace, status, priority, isArchived } = req.query;

    if (!workspace) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    // Build query
    const query = {
      workspace,
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (isArchived !== undefined) query.isArchived = isArchived === "true";

    const projects = await Project.find(query)
      .populate("owner", "name email avatar")
      .populate("workspace", "name")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 });

    // Get task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const tasksCount = await Task.countDocuments({ project: project._id });
        const completedTasksCount = await Task.countDocuments({
          project: project._id,
          status: "completed",
        });

        return {
          ...project.toObject(),
          tasksCount,
          completedTasksCount,
          progress:
            tasksCount > 0
              ? Math.round((completedTasksCount / tasksCount) * 100)
              : 0,
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithCounts.length,
      data: { projects: projectsWithCounts },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("workspace", "name")
      .populate("members.user", "name email avatar");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has access
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get task statistics
    const tasksCount = await Task.countDocuments({ project: project._id });
    const completedTasksCount = await Task.countDocuments({
      project: project._id,
      status: "completed",
    });
    const tasksCountByStatus = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        project: {
          ...project.toObject(),
          tasksCount,
          completedTasksCount,
          progress:
            tasksCount > 0
              ? Math.round((completedTasksCount / tasksCount) * 100)
              : 0,
          tasksCountByStatus: tasksCountByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
      },
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      workspace,
      status,
      priority,
      startDate,
      dueDate,
      members,
      tags,
      color,
    } = req.body;

    // Check if workspace exists and user is a member
    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (!workspaceDoc.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace",
      });
    }

    const project = await Project.create({
      name,
      description,
      workspace,
      owner: req.user._id,
      status: status || "planning",
      priority: priority || "medium",
      startDate,
      dueDate,
      members: members || [{ user: req.user._id, role: "owner" }],
      tags: tags || [],
      color: color || "#3B82F6",
    });

    await project.populate("owner", "name email avatar");
    await project.populate("workspace", "name");
    await project.populate("members.user", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      startDate,
      dueDate,
      tags,
      color,
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner or member with admin role
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const canEdit =
      isOwner || (member && ["owner", "admin"].includes(member.role));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this project",
      });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (tags) project.tags = tags;
    if (color) project.color = color;

    await project.save();
    await project.populate("owner", "name email avatar");
    await project.populate("workspace", "name");
    await project.populate("members.user", "name email avatar");

    res.json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// @desc    Delete/Archive project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete project",
      });
    }

    // Soft delete by archiving
    project.isArchived = true;
    await project.save();

    res.json({
      success: true,
      message: "Project archived successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addProjectMember = async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const canEdit =
      isOwner || (member && ["owner", "admin"].includes(member.role));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add members",
      });
    }

    // Check if user is already a member
    if (project.members.some((m) => m.user.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this project",
      });
    }

    project.members.push({ user: userId, role });
    await project.save();
    await project.populate("members.user", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Add project member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeProjectMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const canEdit =
      isOwner || (member && ["owner", "admin"].includes(member.role));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to remove members",
      });
    }

    // Cannot remove owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove project owner",
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId
    );

    await project.save();

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove project member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};
