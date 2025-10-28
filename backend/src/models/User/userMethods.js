/**
 * User Model Methods
 */

import bcrypt from "bcryptjs";

export const setupUserMethods = (schema) => {
  // Compare password method
  schema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Remove sensitive data when converting to JSON
  schema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    return user;
  };
};
