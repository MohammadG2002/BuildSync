/**
 * Filter members based on search query and role
 */
const filterMembers = (members, searchQuery, roleFilter = "all") => {
  return members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });
};

export default filterMembers;
