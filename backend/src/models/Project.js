import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "archived"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    startDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "admin", "lead", "member", "viewer"],
          default: "member",
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: "#3b82f6",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ workspace: 1, createdAt: -1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ "members.user": 1 });
projectSchema.index({ name: "text", description: "text" });

// Virtual for tasks
projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});

// Calculate progress based on completed tasks
projectSchema.virtual("progress").get(async function () {
  const Task = mongoose.model("Task");
  const totalTasks = await Task.countDocuments({ project: this._id });
  const completedTasks = await Task.countDocuments({
    project: this._id,
    status: "completed",
  });
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
