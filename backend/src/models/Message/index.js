/**
 * Message Model
 */

import mongoose from "mongoose";
import { messageSchema } from "./messageSchema.js";
import { setupMessageIndexes } from "./messageIndexes.js";

// Setup indexes
setupMessageIndexes(messageSchema);

const Message = mongoose.model("Message", messageSchema);

export default Message;
