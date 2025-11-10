import mongoose from "mongoose";

const messageSubSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },
    content: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    // Owner (user who started the chat session)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    model: { type: String, trim: true },
    messages: { type: [messageSubSchema], default: [] },
    usage: {
      prompt_tokens: Number,
      completion_tokens: Number,
      total_tokens: Number,
    },
  },
  { timestamps: true }
);

export default chatSchema;
