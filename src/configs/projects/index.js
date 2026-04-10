import { vvsProject } from "./vvs.js";
import { bathroomProject } from "./bathroom.js";
import { kitchenProject } from "./kitchen.js";

export const projects = {
  vvs: vvsProject,
  bathroom: bathroomProject,
  kitchen: kitchenProject,
};

export const projectList = [vvsProject, bathroomProject, kitchenProject];

export function getProjectConfig(key) {
  return projects[key] || vvsProject;
}
