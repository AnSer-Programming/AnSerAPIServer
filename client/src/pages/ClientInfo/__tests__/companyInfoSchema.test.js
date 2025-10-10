import { companyInfoSchema } from '../utils/validationSchema';

describe('companyInfoSchema', () => {
  const baseData = {
    businessName: 'Test Company',
    physicalLocation: '123 Main St',
    contactNumbers: {
      primaryOfficeLine: '555-123-4567',
      officeEmail: 'office@example.com',
    },
  };

  it('allows submissions without additional locations', () => {
    const errors = companyInfoSchema(baseData);
    expect(errors).toBeNull();
  });

  it('requires address and label when additional location has data', () => {
    const withPartialLocation = {
      ...baseData,
      additionalLocations: [
        { label: 'Warehouse' },
      ],
    };

    const errors = companyInfoSchema(withPartialLocation);

    expect(errors).not.toBeNull();
    expect(errors?.additionalLocations?.[0]?.address).toMatch(/required/i);
    expect(errors?.additionalLocations?.[0]?.label).toBeUndefined();
  });

  it('requires a label when address is provided without one', () => {
    const missingLabel = {
      ...baseData,
      additionalLocations: [
        { address: '456 Distribution Ave' },
      ],
    };

    const errors = companyInfoSchema(missingLabel);

    expect(errors).not.toBeNull();
    expect(errors?.additionalLocations?.[0]?.label).toMatch(/label/i);
  });

  it('accepts complete additional locations', () => {
    const withLocations = {
      ...baseData,
      additionalLocations: [
        {
          label: 'Warehouse',
          address: '456 Distribution Ave',
          suite: 'Unit B',
        },
        {
          label: 'Clinic',
          address: '789 Health Plaza',
        },
      ],
    };

    const errors = companyInfoSchema(withLocations);

    expect(errors).toBeNull();
  });
});
