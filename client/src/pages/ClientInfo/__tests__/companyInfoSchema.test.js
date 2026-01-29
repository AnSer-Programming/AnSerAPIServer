import { companyInfoSchema } from '../utils/validationSchema';

describe('companyInfoSchema', () => {
  const baseData = {
    businessName: 'Test Company',
    physicalLocation: '123 Main St',
    physicalCity: 'Seattle',
    physicalState: 'WA',
    physicalPostalCode: '98101',
    billingSameAsPrimary: true,
    primaryContact: {
      name: 'Alex Johnson',
      phone: '555-111-2222',
      email: 'alex.johnson@example.com',
    },
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

  it('requires at least one phone contact channel', () => {
    const data = {
      ...baseData,
      contactChannels: [
        { type: 'website', value: 'example.com' },
      ],
    };

    const errors = companyInfoSchema(data);

    expect(errors?.contactChannels?.[0]?.value).toMatch(/phone/i);
  });

  it('accepts website without scheme when a phone channel is present', () => {
    const data = {
      ...baseData,
      contactChannels: [
        { type: 'phone', value: '(206) 555-1234' },
        { type: 'website', value: 'abcmedical.com' },
      ],
    };

    const errors = companyInfoSchema(data);

    expect(errors).toBeNull();
  });

  it('ignores empty contact channel rows', () => {
    const data = {
      ...baseData,
      contactChannels: [
        { type: 'website', value: '' },
        { type: 'phone', value: '206-555-1234' },
      ],
    };

    const errors = companyInfoSchema(data);

    expect(errors).toBeNull();
  });
});
