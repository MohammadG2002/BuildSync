/**
 * User Model
 */

import mongoose from "mongoose";
import { userSchema } from "./userSchema.js";
import { setupUserIndexes } from "./userIndexes.js";
import { setupUserMethods } from "./userMethods.js";
import { setupUserHooks } from "./userHooks.js";

// Setup indexes
setupUserIndexes(userSchema);

// Setup methods
setupUserMethods(userSchema);

// Setup hooks
setupUserHooks(userSchema);

const User = mongoose.model("User", userSchema);

export default User;
