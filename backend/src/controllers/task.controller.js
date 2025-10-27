import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import Notification from "../models/Notification.js";

// @desc    Get all tasks
// @route   GET /api/tasks?project=projectId&workspace=workspaceId
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { project, workspace, status, priority, assignedTo } = req.query;

    // Build query
    const query = {
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
    };

    if (project) query.project = project;
    if (workspace) query.workspace = workspace;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
      .populate("comments.user", "name email avatar");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access
    const hasAccess =
      task.assignedTo?._id.toString() === req.user._id.toString() ||
      task.createdBy._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      workspace,
      assignedTo,
      status,
      priority,
      dueDate,
      tags,
    } = req.body;

    // Verify project exists if provided
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    // Verify workspace exists
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

    const task = await Task.create({
      title,
      description,
      project,
      workspace,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      tags: tags || [],
    });

    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Create notification if assigned to someone else
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: "task_assigned",
        title: "New task assigned",
        message: `You have been assigned to "${title}"`,
        link: `/tasks/${task._id}`,
        metadata: {
          taskId: task._id,
          projectId: project,
          workspaceId: workspace,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate, tags } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user can edit
    const canEdit =
      task.createdBy.toString() === req.user._id.toString() ||
      task.assignedTo?.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this task",
      });
    }

    const oldAssignedTo = task.assignedTo?.toString();
    const oldStatus = task.status;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;

    await task.save();
    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Create notifications for changes
    if (
      assignedTo &&
      assignedTo !== oldAssignedTo &&
      assignedTo !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: "task_assigned",
        title: "New task assigned",
        message: `You have been assigned to "${task.title}"`,
        link: `/tasks/${task._id}`,
        metadata: {
          taskId: task._id,
          projectId: task.project,
          workspaceId: task.workspace,
        },
      });
    }

    if (status && status !== oldStatus) {
      const notifyUsers = [task.createdBy.toString()];
      if (
        task.assignedTo &&
        task.assignedTo.toString() !== req.user._id.toString()
      ) {
        notifyUsers.push(task.assignedTo.toString());
      }

      for (const userId of notifyUsers) {
        if (userId !== req.user._id.toString()) {
          await Notification.create({
            recipient: userId,
            sender: req.user._id,
            type: "task_updated",
            title: "Task status updated",
            message: `Status of "${task.title}" changed to ${status}`,
            link: `/tasks/${task._id}`,
            metadata: {
              taskId: task._id,
              projectId: task.project,
              workspaceId: task.workspace,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only task creator can delete task",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, content } = req.body;
    const commentText = text || content;

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.comments.push({
      user: req.user._id,
      content: commentText,
    });

    await task.save();
    await task.populate("comments.user", "name email avatar");

    // Create notification for task creator and assignee
    const notifyUsers = [task.createdBy.toString()];
    if (
      task.assignedTo &&
      task.assignedTo.toString() !== task.createdBy.toString()
    ) {
      notifyUsers.push(task.assignedTo.toString());
    }

    for (const userId of notifyUsers) {
      if (userId !== req.user._id.toString()) {
        await Notification.create({
          recipient: userId,
          sender: req.user._id,
          type: "comment_added",
          title: "New comment on task",
          message: `${req.user.name} commented on "${task.title}"`,
          link: `/tasks/${task._id}`,
          metadata: {
            taskId: task._id,
            projectId: task.project,
            workspaceId: task.workspace,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// @desc    Add attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
export const addAttachment = async (req, res) => {
  try {
    const { name, url, size, type } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Attachment name and URL are required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.attachments.push({
      name,
      url,
      size,
      type,
      uploadedBy: req.user._id,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Attachment added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add attachment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add attachment",
    });
  }
};
