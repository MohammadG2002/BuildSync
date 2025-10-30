/**
 * Handle project click navigation
 */
const handleProjectClick = (project, workspaceId, navigate) => {
  navigate(`/app/workspaces/${workspaceId}/projects/${project.id}`);
};

export default handleProjectClick;
