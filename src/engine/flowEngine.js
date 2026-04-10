export function buildSteps(project) {
  return [
    "welcome",
    "project",
    "category",
    "size",
    "details",
    "photos",
    ...project.elementGroups.map((group) => `group:${group.key}`),
    "budget",
    "timeline",
    "contact_name",
    "contact_email",
    "contact_phone",
    "contact_address",
    "summary",
  ];
}

export function getStepIndex(project, stepKey) {
  return buildSteps(project).indexOf(stepKey);
}
