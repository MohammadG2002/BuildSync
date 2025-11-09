/**
 * TagDefinition Schema
 * Represents a reusable tag within a workspace with display colors.
 */

import mongoose from "mongoose";

export const tagDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
      lowercase: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    color: {
      type: String,
      default: "#111827", // text color
    },
    backgroundColor: {
      type: String,
      default: "#E5E7EB", // bg color
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique tag name per workspace (case-insensitive due to lowercase)
tagDefinitionSchema.index({ workspace: 1, name: 1 }, { unique: true });
