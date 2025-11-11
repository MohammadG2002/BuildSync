import mongoose from "mongoose";

const AIChatLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AIChatLog", AIChatLogSchema);
