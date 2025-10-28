/**
 * Notification Model
 */

import mongoose from "mongoose";
import { notificationSchema } from "./notificationSchema.js";
import { setupNotificationIndexes } from "./notificationIndexes.js";

// Setup indexes
setupNotificationIndexes(notificationSchema);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
