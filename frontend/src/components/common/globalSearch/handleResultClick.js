// Handle result click and navigation
const handleResultClick = (
  result,
  type,
  navigate,
  setIsOpen,
  setSearchQuery
) => {
  setIsOpen(false);
  setSearchQuery("");

  // Navigate based on type
  switch (type) {
    case "workspace":
      navigate(`/app/workspaces/${result.id}`);
      break;
    case "project":
      navigate(`/app/workspaces/1/projects/${result.id}`);
      break;
    case "task":
      navigate(`/app/workspaces/1/projects/1`);
      break;
    case "member":
      navigate(`/app/workspaces/1/members`);
      break;
    default:
      break;
  }
};

export default handleResultClick;
