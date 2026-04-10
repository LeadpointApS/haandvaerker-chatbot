import { budgetOptions } from "../configs/shared.js";

export function calculateEstimate(project, answers) {
  const category = project.categoryOptions.find((item) => item.key === answers.category);
  const size = project.sizeOptions.find((item) => item.key === answers.size);
  const budget = budgetOptions.find((item) => item.key === answers.budget);

  const groupLow = project.elementGroups.reduce((sum, group) => {
    const chosen = group.options.find((option) => option.key === answers.elements?.[group.key]);
    return sum + (chosen?.priceRange?.[0] || 0);
  }, 0);

  const groupHigh = project.elementGroups.reduce((sum, group) => {
    const chosen = group.options.find((option) => option.key === answers.elements?.[group.key]);
    return sum + (chosen?.priceRange?.[1] || 0);
  }, 0);

  const categoryLow = category?.priceRange?.[0] || 0;
  const categoryHigh = category?.priceRange?.[1] || 0;
  const sizeLow = size?.priceRange?.[0] || 0;
  const sizeHigh = size?.priceRange?.[1] || 0;

  const detailFactor = answers.details?.length > 120 ? 1.08 : answers.details?.length > 40 ? 1.03 : 1;
  const photoFactor = (answers.photos?.length || 0) >= 2 ? 1.02 : 1;

  let low = Math.round((project.estimateBase.low + categoryLow + sizeLow + groupLow) * detailFactor * photoFactor);
  let high = Math.round((project.estimateBase.high + categoryHigh + sizeHigh + groupHigh) * detailFactor * photoFactor);

  if (category?.factor) {
    low = Math.round(low * category.factor);
    high = Math.round(high * category.factor);
  }

  if (size?.factor) {
    low = Math.round(low * size.factor);
    high = Math.round(high * size.factor);
  }

  if (budget?.factor) {
    low = Math.round(low * Math.min(budget.factor, 1.08));
    high = Math.round(high * budget.factor);
  }

  return {
    low,
    high,
    center: Math.round((low + high) / 2),
  };
}

export function getEstimateFeedback(project, estimate) {
  if (estimate.center >= project.feedback.highThreshold) return project.feedback.high;
  if (estimate.center >= project.feedback.midThreshold) return project.feedback.mid;
  return project.feedback.low;
}
