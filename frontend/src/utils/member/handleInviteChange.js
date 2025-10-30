/**
 * Handle invite form input changes
 */
const handleInviteChange = (
  e,
  setInviteData,
  inviteErrors,
  setInviteErrors
) => {
  const { name, value } = e.target;
  setInviteData((prev) => ({ ...prev, [name]: value }));
  if (inviteErrors[name]) {
    setInviteErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

export default handleInviteChange;
