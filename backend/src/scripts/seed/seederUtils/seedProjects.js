/**
 * Seed Projects
 * Seeds projects into database
 */

import Project from "../../../models/Project/index.js";

/**
 * Seed projects
 */
export const seedProjects = async (projectsData) => {
  console.log("Creating demo projects...");
  return await Project.create(projectsData);
};
