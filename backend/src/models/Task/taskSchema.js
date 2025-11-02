/**
 * Task Schema Definition
 */

import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "completed", "blocked"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, "Subtask title cannot exceed 200 characters"],
        },
        completed: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        attachments: [
          {
            name: String,
            url: String,
            size: Number,
            type: String,
            uploadedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Per-project sequence number (e.g., #1, #2)
    sequence: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
