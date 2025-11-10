import mongoose from "mongoose";
import chatSchema from "./chatSchema.js";

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
