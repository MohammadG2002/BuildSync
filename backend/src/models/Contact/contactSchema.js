/**
 * Contact Schema Definition
 */

import mongoose from "mongoose";

export const contactSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
      index: true,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure exactly 2 users and sort pair for unique index stability
contactSchema.pre("validate", function (next) {
  if (!Array.isArray(this.users) || this.users.length !== 2) {
    return next(new Error("Contact requires exactly two users"));
  }
  // Sort as strings for stable ordering
  const [a, b] = this.users.map((u) => u.toString()).sort();
  this.users = [a, b];
  next();
});

// Unique compound index on user pair
contactSchema.index({ "users.0": 1, "users.1": 1 }, { unique: true });
