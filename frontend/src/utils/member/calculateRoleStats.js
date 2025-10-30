/**
 * Calculate role statistics
 */
const calculateRoleStats = (members) => {
  return {
    total: members.length,
    owner: members.filter((m) => m.role === "owner").length,
    admin: members.filter((m) => m.role === "admin").length,
    member: members.filter((m) => m.role === "member").length,
  };
};

export default calculateRoleStats;
