/**
 * Update Task Controller
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";
import TaskActivity from "../../models/TaskActivity/index.js";
import { ensureExistingTags } from "../../utils/tags/validateTags.js";

export const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assigneeIds,
      status,
      priority,
      startDate,
      dueDate,
      tags,
      dependencies: incomingDependencies,
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user can edit - creator, assigned user, or project member
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssigned =
      task.assignedTo && Array.isArray(task.assignedTo)
        ? task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
          )
        : false;

    // Check if user is a project member (defensive against missing project/members)
    const project = await Project.findById(task.project);
    const isProjectMember = Array.isArray(project?.members)
      ? project.members.some(
          (member) => member.user.toString() === req.user._id.toString()
        )
      : false;

    // Workspace viewers are read-only even if assigned/member
    const workspaceDoc = await Workspace.findById(task.workspace);
    // Use optional call to avoid calling undefined when workspace not found
    const roleInWorkspace = workspaceDoc?.getUserRole?.(req.user._id) ?? null;

    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot update tasks",
      });
    }

    // Check if user can edit - project member or workspace owner/admin
    if (
      !isProjectMember &&
      !(roleInWorkspace === "owner" || roleInWorkspace === "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this task",
      });
    }

    const oldAssignedTo =
      task.assignedTo && Array.isArray(task.assignedTo)
        ? task.assignedTo.map((id) => id.toString())
        : [];
    const oldStatus = task.status;
    const oldTitle = task.title;
    const oldPriority = task.priority;
    const oldDueDate = task.dueDate
      ? new Date(task.dueDate).toISOString()
      : null;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assigneeIds !== undefined) {
      // Process assigneeIds - ensure it's an array
      if (Array.isArray(assigneeIds)) {
        task.assignedTo = assigneeIds;
      } else if (assigneeIds) {
        task.assignedTo = [assigneeIds];
      } else {
        task.assignedTo = [];
      }
    }
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (startDate !== undefined) task.startDate = startDate;
    if (dueDate !== undefined) task.dueDate = dueDate;

    // Validate order if both dates are set
    if (task.startDate && task.dueDate) {
      const s = new Date(task.startDate).getTime();
      const d = new Date(task.dueDate).getTime();
      if (!isNaN(s) && !isNaN(d) && d < s) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be before start date",
        });
      }
    }
    if (tags !== undefined) {
      // Validate and normalize tags against workspace TagDefinitions (allow clearing with [])
      const normalizedTags = await ensureExistingTags(task.workspace, tags);
      task.tags = normalizedTags;
    }

    // Handle dependencies update (single implementation)
    if (incomingDependencies !== undefined) {
      let depIds = Array.isArray(incomingDependencies)
        ? incomingDependencies
        : [];
      depIds = [...new Set(depIds.filter(Boolean))];
      if (depIds.length > 0) {
        const depTasks = await Task.find({
          _id: { $in: depIds },
          project: task.project,
          workspace: task.workspace,
        }).select("_id");
        const foundIds = depTasks.map((t) => t._id.toString());
        const missing = depIds.filter(
          (id) => !foundIds.includes(id.toString())
        );
        if (missing.length > 0) {
          return res.status(400).json({
            success: false,
            message: "All dependencies must be tasks in the same project",
          });
        }
      }
      const selfId = task._id.toString();
      task.dependencies = depIds.filter((id) => id.toString() !== selfId);
    }

    // Defensive sanitation: fix any malformed attachment arrays that could break validation
    const coerceAttachmentArray = (value) => {
      try {
        if (Array.isArray(value)) {
          const out = [];
          for (const el of value) {
            if (typeof el === "string") {
              try {
                const parsed = JSON.parse(el);
                if (Array.isArray(parsed)) out.push(...parsed);
                else if (parsed && typeof parsed === "object") out.push(parsed);
                // else ignore
              } catch (_) {
                // ignore unparseable strings
              }
            } else if (el && typeof el === "object") {
              out.push(el);
            }
          }
          return out;
        }
        if (typeof value === "string") {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === "object") return [parsed];
        }
      } catch (_) {
        // fallthrough
      }
      return value;
    };

    // Coerce top-level attachments and testAttachments if needed
    if (task.attachments != null) {
      task.attachments = coerceAttachmentArray(task.attachments);
    }
    if (task.testAttachments != null) {
      task.testAttachments = coerceAttachmentArray(task.testAttachments);
    }
    // Also sanitize comment attachments arrays
    if (Array.isArray(task.comments)) {
      task.comments = task.comments.map((c) => {
        if (!c) return c;
        if (c.attachments != null) {
          c.attachments = coerceAttachmentArray(c.attachments);
        }
        return c;
      });
    }

    await task.save();
    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");
    await task.populate({
      path: "dependencies",
      select: "title status sequence",
    });

    // Create notifications for newly assigned members
    if (assigneeIds !== undefined) {
      const newAssignedTo = task.assignedTo.map((id) => id._id.toString());
      const newlyAssigned = newAssignedTo.filter(
        (userId) => !oldAssignedTo.includes(userId)
      );

      const notificationPromises = newlyAssigned
        .filter((userId) => userId !== req.user._id.toString())
        .map((userId) =>
          Notification.create({
            recipient: userId,
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
          })
        );

      await Promise.all(notificationPromises);
    }

    // Notify about status changes
    if (status && status !== oldStatus) {
      const notifyUsers = [task.createdBy._id.toString()];
      task.assignedTo.forEach((user) => {
        const userId = user._id.toString();
        if (userId !== req.user._id.toString()) {
          notifyUsers.push(userId);
        }
      });

      const uniqueUsers = [...new Set(notifyUsers)];

      for (const userId of uniqueUsers) {
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
              projectId: task.project._id || task.project,
              workspaceId: task.workspace._id || task.workspace,
            },
          });
        }
      }
    }

    // Log activity entries (non-blocking)
    try {
      const activities = [];
      if (title && title !== oldTitle) {
        activities.push({
          task: task._id,
          project: task.project._id || task.project,
          workspace: task.workspace._id || task.workspace,
          actor: req.user._id,
          type: "title_changed",
          meta: { from: oldTitle, to: title },
        });
      }
      if (status && status !== oldStatus) {
        activities.push({
          task: task._id,
          project: task.project._id || task.project,
          workspace: task.workspace._id || task.workspace,
          actor: req.user._id,
          type: "status_changed",
          meta: { from: oldStatus, to: status },
        });
      }
      if (priority && priority !== oldPriority) {
        activities.push({
          task: task._id,
          project: task.project._id || task.project,
          workspace: task.workspace._id || task.workspace,
          actor: req.user._id,
          type: "priority_changed",
          meta: { from: oldPriority, to: priority },
        });
      }
      if (dueDate !== undefined) {
        const newDue = task.dueDate
          ? new Date(task.dueDate).toISOString()
          : null;
        if (newDue !== oldDueDate) {
          activities.push({
            task: task._id,
            project: task.project._id || task.project,
            workspace: task.workspace._id || task.workspace,
            actor: req.user._id,
            type: "due_date_changed",
            meta: { from: oldDueDate, to: newDue },
          });
        }
      }
      if (assigneeIds !== undefined) {
        const newAssignedTo = (task.assignedTo || []).map((u) =>
          (u._id || u).toString()
        );
        const added = newAssignedTo.filter((id) => !oldAssignedTo.includes(id));
        const removed = oldAssignedTo.filter(
          (id) => !newAssignedTo.includes(id)
        );
        if (added.length || removed.length) {
          activities.push({
            task: task._id,
            project: task.project._id || task.project,
            workspace: task.workspace._id || task.workspace,
            actor: req.user._id,
            type: "assignees_changed",
            meta: { added, removed },
          });
        }
      }
      if (activities.length) {
        await TaskActivity.insertMany(activities);
      }
    } catch (e) {
      console.warn("Failed to log task update activity", e?.message);
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
