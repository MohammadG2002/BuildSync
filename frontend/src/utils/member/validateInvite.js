/**
 * Validate invite form data
 */
const validateInvite = (inviteData, members) => {
  const errors = {};
  if (!inviteData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(inviteData.email)) {
    errors.email = "Email is invalid";
  } else if (members.some((m) => m.email === inviteData.email)) {
    errors.email = "This user is already a member";
  }
  return errors;
};

export default validateInvite;
