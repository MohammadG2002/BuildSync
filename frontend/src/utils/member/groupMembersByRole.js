const groupMembersByRole = (members) => {
  return {
    owner: members.filter((m) => m.role === "owner"),
    admin: members.filter((m) => m.role === "admin"),
    member: members.filter((m) => m.role === "member"),
    viewer: members.filter((m) => m.role === "viewer"),
  };
};

export default groupMembersByRole;
