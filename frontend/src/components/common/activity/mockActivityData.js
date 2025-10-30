// Generate activity description based on type
export const getActivityDescription = (type, user, project, task) => {
  switch (type) {
    case "task_created":
      return `created task "${task}" in ${project}`;
    case "task_completed":
      return `completed task "${task}"`;
    case "task_updated":
      return `updated task "${task}"`;
    case "task_deleted":
      return `deleted task "${task}"`;
    case "comment_added":
      return `commented on "${task}"`;
    case "member_added":
      return `added a new member to ${project}`;
    case "member_removed":
      return `removed a member from ${project}`;
    case "file_uploaded":
      return `uploaded a file to "${task}"`;
    case "file_downloaded":
      return `downloaded a file from "${task}"`;
    case "project_created":
      return `created project "${project}"`;
    case "project_archived":
      return `archived project "${project}"`;
    case "settings_changed":
      return `updated ${project} settings`;
    case "status_changed":
      return `changed status of "${task}"`;
    default:
      return `performed an action`;
  }
};

// MOCK DATA - Commented out for production, uncomment for testing
// Generate mock activities for demonstration
// export const generateMockActivities = (activityConfig) => {
//   const types = Object.keys(activityConfig);
//   const users = [
//     "John Doe",
//     "Jane Smith",
//     "Mike Johnson",
//     "Sarah Williams",
//     "Tom Brown",
//   ];
//   const projects = [
//     "Website Redesign",
//     "Mobile App",
//     "API Development",
//     "Marketing Campaign",
//   ];
//   const tasks = [
//     "Update homepage",
//     "Fix navigation bug",
//     "Add dark mode",
//     "Create user guide",
//   ];

//   return Array.from({ length: 20 }, (_, i) => {
//     const type = types[Math.floor(Math.random() * types.length)];
//     const user = users[Math.floor(Math.random() * users.length)];
//     const project = projects[Math.floor(Math.random() * projects.length)];
//     const task = tasks[Math.floor(Math.random() * tasks.length)];

//     return {
//       id: i + 1,
//       type,
//       user: {
//         name: user,
//         avatar: `https://ui-avatars.com/api/?name=${user.replace(
//           " ",
//           "+"
//         )}&background=random`,
//       },
//       description: getActivityDescription(type, user, project, task),
//       timestamp: new Date(
//         Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
//       ).toISOString(),
//       metadata: {
//         project,
//         task,
//       },
//     };
//   }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
// };
