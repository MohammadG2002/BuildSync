/**
 * Message Schema Definition
 */

import mongoose from "mongoose";

// Subschema for attachments to ensure predictable casting and avoid ObjectId casts
const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    url: { type: String, trim: true },
    size: { type: Number },
    type: { type: String, trim: true },
  },
  { _id: false, strict: false }
);

export const messageSchema = new mongoose.Schema(
  {
    // Optional workspace: present for workspace-wide messages; omitted for global DMs
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: false,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Optional recipient for direct messages (DM);
    // when absent, message is considered workspace-wide
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },
    attachments: { type: [attachmentSchema], default: [] },
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

// Defensive sanitation in case controllers misshape attachments
messageSchema.pre("validate", function (next) {
  try {
    if (!Array.isArray(this.attachments)) {
      this.attachments = [];
      return next();
    }
    this.attachments = this.attachments
      .filter((a) => a && typeof a === "object")
      .map((a) => ({
        name: a.name || "Attachment",
        url: typeof a.url === "string" ? a.url : undefined,
        size: typeof a.size === "number" ? a.size : undefined,
        type: typeof a.type === "string" ? a.type : undefined,
      }))
      .filter((a) => typeof a.url === "string" && a.url.length > 0);
    return next();
  } catch (err) {
    return next(err);
  }
});
