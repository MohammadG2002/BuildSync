import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member", "viewer"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      visibility: {
        type: String,
        enum: ["private", "team", "public"],
        default: "private",
      },
      allowInvites: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
workspaceSchema.index({ owner: 1, createdAt: -1 });
workspaceSchema.index({ "members.user": 1 });
workspaceSchema.index({ name: "text", description: "text" });

// Virtual for projects
workspaceSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "workspace",
});

// Check if user is member (includes owner)
workspaceSchema.methods.isMember = function (userId) {
  // Check if user is owner
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  // Check if user is in members array
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Get user role in workspace (includes owner)
workspaceSchema.methods.getUserRole = function (userId) {
  // Check if user is owner
  if (this.owner.toString() === userId.toString()) {
    return "owner";
  }
  // Check members array
  const member = this.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member?.role || null;
};

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
