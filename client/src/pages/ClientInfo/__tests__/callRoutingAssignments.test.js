import { syncCategoryAssignments } from '../utils/callRoutingAssignments';

describe('callRoutingAssignments', () => {
  test('creates default assignments for new categories', () => {
    const categories = [
      { id: 'cat-1', selectedCommon: 'Category One' },
      { id: 'cat-2', customName: 'Custom Two' },
    ];

    const { changed, nextAssignments } = syncCategoryAssignments(categories, [], () => 'step-fixed');

    expect(changed).toBe(true);
    expect(nextAssignments).toHaveLength(2);
    expect(nextAssignments[0].categoryId).toBe('cat-1');
    expect(nextAssignments[0].categoryName).toBe('Category One');
    expect(nextAssignments[0].escalationSteps[0].id).toBe('step-fixed');
    expect(nextAssignments[1].categoryName).toBe('Custom Two');
  });

  test('updates assignment category names when category labels change', () => {
    const categories = [{ id: 'cat-1', customName: 'Renamed Category' }];
    const existing = [{
      categoryId: 'cat-1',
      categoryName: 'Old Category',
      whenToContact: 'all-hours',
      specialInstructions: 'keep me',
      finalAction: 'repeat-until-delivered',
      escalationSteps: [{ id: 's1' }],
    }];

    const { changed, nextAssignments } = syncCategoryAssignments(categories, existing, () => 'step-fixed');

    expect(changed).toBe(true);
    expect(nextAssignments[0].categoryName).toBe('Renamed Category');
    expect(nextAssignments[0].specialInstructions).toBe('keep me');
  });

  test('removes stale assignments and keeps category order aligned', () => {
    const categories = [
      { id: 'cat-2', selectedCommon: 'Second' },
      { id: 'cat-1', selectedCommon: 'First' },
    ];
    const existing = [
      { categoryId: 'cat-1', categoryName: 'First', escalationSteps: [{ id: 'a' }] },
      { categoryId: 'cat-2', categoryName: 'Second', escalationSteps: [{ id: 'b' }] },
      { categoryId: 'cat-3', categoryName: 'Stale', escalationSteps: [{ id: 'c' }] },
    ];

    const { changed, nextAssignments } = syncCategoryAssignments(categories, existing, () => 'step-fixed');

    expect(changed).toBe(true);
    expect(nextAssignments).toHaveLength(2);
    expect(nextAssignments[0].categoryId).toBe('cat-2');
    expect(nextAssignments[1].categoryId).toBe('cat-1');
  });

  test('reports unchanged when assignments already match category list', () => {
    const categories = [{ id: 'cat-1', selectedCommon: 'Stable Name' }];
    const existing = [
      { categoryId: 'cat-1', categoryName: 'Stable Name', escalationSteps: [{ id: 'a' }] },
    ];

    const { changed, nextAssignments } = syncCategoryAssignments(categories, existing, () => 'step-fixed');

    expect(changed).toBe(false);
    expect(nextAssignments[0]).toBe(existing[0]);
  });
});
