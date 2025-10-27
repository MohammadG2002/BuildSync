import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Get all workspaces for user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
      isActive: true,
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workspaces.length,
      data: { workspaces },
    });
  } catch (error) {
    console.error("Get workspaces error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
    });
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user has access
    const isMember = workspace.isMember(req.user._id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get projects count
    const projectsCount = await Project.countDocuments({
      workspace: workspace._id,
      isArchived: false,
    });

    res.json({
      success: true,
      data: {
        workspace: {
          ...workspace.toObject(),
          projectsCount,
        },
      },
    });
  } catch (error) {
    console.error("Get workspace error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
    });
  }
};

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
        },
      ],
      settings: settings || {},
    });

    await workspace.populate("owner", "name email avatar");
    await workspace.populate("members.user", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: { workspace },
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workspace",
    });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
export const updateWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is owner or admin
    const userRole = workspace.getUserRole(req.user._id);
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owners and admins can update workspace",
      });
    }

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (settings) workspace.settings = { ...workspace.settings, ...settings };

    await workspace.save();
    await workspace.populate("owner", "name email avatar");
    await workspace.populate("members.user", "name email avatar");

    res.json({
      success: true,
      message: "Workspace updated successfully",
      data: { workspace },
    });
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workspace",
    });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owner can delete workspace",
      });
    }

    // Soft delete
    workspace.isActive = false;
    await workspace.save();

    res.json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workspace",
    });
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
export const addMember = async (req, res) => {
  try {
    const { userId, email, role = "member" } = req.body;

    // Either userId or email must be provided
    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: "Either userId or email is required",
      });
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is owner or admin
    const userRole = workspace.getUserRole(req.user._id);
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owners and admins can add members",
      });
    }

    // If email is provided, find user by email
    let targetUserId = userId;
    if (email && !userId) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this email address",
        });
      }
      targetUserId = user._id;
    }

    // Check if user is already a member
    if (workspace.isMember(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this workspace",
      });
    }

    workspace.members.push({
      user: targetUserId,
      role,
    });

    await workspace.save();
    await workspace.populate("members.user", "name email avatar");

    // Create notification for the invited user
    await Notification.create({
      recipient: targetUserId,
      sender: req.user._id,
      type: "workspace_invite",
      title: "Workspace Invitation",
      message: `${req.user.name} added you to the workspace "${workspace.name}"`,
      link: `/workspaces/${workspace._id}`,
      metadata: {
        workspaceId: workspace._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: { workspace },
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:userId
// @access  Private
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is owner or admin
    const userRole = workspace.getUserRole(req.user._id);
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owners and admins can remove members",
      });
    }

    // Cannot remove owner
    if (workspace.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove workspace owner",
      });
    }

    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== userId
    );

    await workspace.save();

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};
