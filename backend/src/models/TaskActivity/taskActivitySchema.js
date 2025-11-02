import mongoose from "mongoose";

const { Schema } = mongoose;

export const taskActivitySchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      index: true,
      required: true,
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "created",
        "title_changed",
        "status_changed",
        "priority_changed",
        "due_date_changed",
        "assignees_changed",
        "comment_added",
        "attachment_added",
        "subtask_added",
      ],
      required: true,
    },
    meta: { type: Schema.Types.Mixed },
    message: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

taskActivitySchema.index({ task: 1, createdAt: -1 });
