/**
 * User Model Hooks/Middleware
 */

import bcrypt from "bcryptjs";

export const setupUserHooks = (schema) => {
  // Hash password before saving
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
};
