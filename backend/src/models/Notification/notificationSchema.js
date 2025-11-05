/**
 * Notification Schema Definition
 */

import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "task_assigned",
        "task_updated",
        "task_completed",
        "comment_added",
        "mention",
        "project_updated",
        "member_added",
        "member_removed",
        "workspace_invite",
        // Contacts
        "contact_request",
        "contact_accepted",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: null,
    },
    metadata: {
      workspaceId: mongoose.Schema.Types.ObjectId,
      projectId: mongoose.Schema.Types.ObjectId,
      taskId: mongoose.Schema.Types.ObjectId,
      contactId: mongoose.Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // Optional status (used for actionable notifications like invites)
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
