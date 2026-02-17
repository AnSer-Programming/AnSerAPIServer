const defaultStepId = () => `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const categoryNameFromConfig = (category = {}) =>
  category.customName || category.selectedCommon || 'Unnamed Category';

const buildDefaultCategoryAssignment = (category = {}, createStepId = defaultStepId) => ({
  categoryId: category.id,
  categoryName: categoryNameFromConfig(category),
  whenToContact: 'all-hours',
  specialInstructions: '',
  finalAction: 'repeat-until-delivered',
  afterHoursFinalAction: 'repeat-until-delivered',
  escalationSteps: [
    {
      id: createStepId(),
      contactPerson: '',
      contactMethod: 'call',
      notes: '',
      repeatSteps: false,
      holdForCheckIn: false,
    }
  ],
});

const syncCategoryAssignments = (categories = [], assignments = [], createStepId = defaultStepId) => {
  const assignmentByCategory = new Map(assignments.map((assignment) => [assignment.categoryId, assignment]));
  const nextAssignments = categories.map((category) => {
    const existing = assignmentByCategory.get(category.id);
    const nextName = categoryNameFromConfig(category);
    if (!existing) return buildDefaultCategoryAssignment(category, createStepId);
    if ((existing.categoryName || '') !== nextName) {
      return { ...existing, categoryName: nextName };
    }
    return existing;
  });

  const changed =
    assignments.length !== nextAssignments.length ||
    assignments.some((assignment, idx) => assignment !== nextAssignments[idx]);

  return { changed, nextAssignments };
};

export {
  buildDefaultCategoryAssignment,
  syncCategoryAssignments,
};
