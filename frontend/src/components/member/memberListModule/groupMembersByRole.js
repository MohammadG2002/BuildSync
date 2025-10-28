const groupMembersByRole = (members) => {
  return {
    admin: members.filter((m) => m.role === "admin"),
    member: members.filter((m) => m.role === "member"),
    viewer: members.filter((m) => m.role === "viewer"),
  };
};

export default groupMembersByRole;
