/**
 * Message Schema Definition
 */

import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
