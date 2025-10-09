import React, { useMemo } from 'react';
import { validateSection } from './validationSchema';

/**
 * Advanced form field dependencies and conditional logic
 * Manages field visibility, requirements, and validation based on other field values
 */

export const useFieldDependencies = (formData, currentSection) => {
  /**
   * Define field dependency rules
   * Format: { fieldName: { dependsOn: 'otherField', condition: (value) => boolean, action: 'show'|'hide'|'require' } }
   */
  const dependencyRules = useMemo(() => ({
    // Company Info Dependencies
    companyInfo: {
      // Show industry-specific fields based on business type
      professionalServices: {
        dependsOn: 'businessType',
        condition: (value) => ['legal', 'medical', 'consulting', 'accounting'].includes(value),
        action: 'show'
      },
      appointmentBooking: {
        dependsOn: 'businessType', 
        condition: (value) => ['medical', 'dental', 'salon', 'spa', 'automotive'].includes(value),
        action: 'show'
      },
      emergencyProtocol: {
        dependsOn: 'businessType',
        condition: (value) => ['medical', 'legal', 'emergency'].includes(value),
        action: 'require'
      },
      // Website is required for certain business types
      website: {
        dependsOn: 'businessType',
        condition: (value) => ['ecommerce', 'saas', 'technology'].includes(value),
        action: 'require'
      }
    },

    // Answer Calls Dependencies  
    answerCalls: {
      // Custom routine text required when not using standard
      customRoutineText: {
        dependsOn: 'routine.useStandard',
        condition: (value) => value === false,
        action: 'require'
      },
      // Custom urgent text required when not using standard
      customUrgentText: {
        dependsOn: 'urgent.useStandard', 
        condition: (value) => value === false,
        action: 'require'
      },
      // Show escalation options for urgent calls
      escalationOptions: {
        dependsOn: 'urgent.useStandard',
        condition: (value) => value === false,
        action: 'show'
      }
    },

    // Office Reach Dependencies
    officeReach: {
      // Mobile number required if mobile notifications enabled
      mobileNumber: {
        dependsOn: 'notificationPreferences.mobile',
        condition: (value) => value === true,
        action: 'require'
      },
      // Email required if email notifications enabled
      email: {
        dependsOn: 'notificationPreferences.email', 
        condition: (value) => value === true,
        action: 'require'
      },
      // Slack webhook required if Slack integration enabled
      slackWebhook: {
        dependsOn: 'integrations.slack',
        condition: (value) => value === true,
        action: 'require'
      }
    },

    // On Call Dependencies
    onCall: {
      // Backup contact required for 24/7 services
      backupContact: {
        dependsOn: 'availability.is24x7',
        condition: (value) => value === true,
        action: 'require'
      },
      // Holiday schedule required if custom holiday handling
      holidaySchedule: {
        dependsOn: 'holidayHandling.useCustom',
        condition: (value) => value === true,
        action: 'show'
      }
    }
  }), []);

  /**
   * Check if a field should be visible based on dependencies
   */
  const isFieldVisible = (fieldName) => {
    const rule = dependencyRules[currentSection]?.[fieldName];
    if (!rule || rule.action === 'require') return true;
    
    const dependentValue = getNestedValue(formData[currentSection], rule.dependsOn);
    const shouldShow = rule.condition(dependentValue);
    
    return rule.action === 'show' ? shouldShow : !shouldShow;
  };

  /**
   * Check if a field is required based on dependencies
   */
  const isFieldRequired = (fieldName, baseRequired = false) => {
    const rule = dependencyRules[currentSection]?.[fieldName];
    if (!rule || rule.action !== 'require') return baseRequired;
    
    const dependentValue = getNestedValue(formData[currentSection], rule.dependsOn);
    return rule.condition(dependentValue);
  };

  /**
   * Get conditional validation errors
   */
  const getConditionalErrors = () => {
    const errors = validateSection(currentSection, formData[currentSection] || {});
    const conditionalErrors = {};

    Object.keys(dependencyRules[currentSection] || {}).forEach(fieldName => {
      const rule = dependencyRules[currentSection][fieldName];
      
      if (rule.action === 'require') {
        const dependentValue = getNestedValue(formData[currentSection], rule.dependsOn);
        const isRequired = rule.condition(dependentValue);
        
        if (isRequired) {
          const fieldValue = getNestedValue(formData[currentSection], fieldName);
          if (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim())) {
            conditionalErrors[fieldName] = `This field is required when ${rule.dependsOn} is configured.`;
          }
        }
      }
    });

    return { ...errors, ...conditionalErrors };
  };

  /**
   * Get suggested field values based on other fields
   */
  const getFieldSuggestions = (fieldName) => {
    const sectionData = formData[currentSection] || {};
    
    // Business type-based suggestions
    if (fieldName === 'businessHours' && sectionData.businessType) {
      const suggestions = {
        'retail': '9:00 AM - 9:00 PM',
        'medical': '8:00 AM - 5:00 PM', 
        'legal': '9:00 AM - 6:00 PM',
        'restaurant': '11:00 AM - 10:00 PM',
        'automotive': '7:00 AM - 7:00 PM'
      };
      return suggestions[sectionData.businessType];
    }

    // Phone format suggestions based on region
    if (fieldName === 'phoneNumber' && sectionData.country) {
      const formats = {
        'US': '(555) 123-4567',
        'CA': '(555) 123-4567', 
        'UK': '+44 20 1234 5678',
        'AU': '+61 2 1234 5678'
      };
      return formats[sectionData.country];
    }

    return null;
  };

  /**
   * Get progress percentage for current section
   */
  const getSectionProgress = () => {
    const sectionData = formData[currentSection] || {};
    const allFields = Object.keys(dependencyRules[currentSection] || {});
    const visibleFields = allFields.filter(field => isFieldVisible(field));
    const filledFields = visibleFields.filter(field => {
      const value = getNestedValue(sectionData, field);
      return value && (typeof value !== 'string' || value.trim());
    });
    
    return visibleFields.length > 0 ? (filledFields.length / visibleFields.length) * 100 : 0;
  };

  return {
    isFieldVisible,
    isFieldRequired,
    getConditionalErrors,
    getFieldSuggestions,
    getSectionProgress,
    dependencyRules: dependencyRules[currentSection] || {}
  };
};

/**
 * Helper function to get nested object values safely
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Field dependency wrapper component
 */
export const ConditionalField = ({ 
  children, 
  fieldName, 
  formData, 
  currentSection,
  fallback = null 
}) => {
  const { isFieldVisible } = useFieldDependencies(formData, currentSection);
  
  return isFieldVisible(fieldName) ? children : fallback;
};

/**
 * Required field indicator component
 */
export const RequiredIndicator = ({ 
  fieldName, 
  baseRequired = false, 
  formData, 
  currentSection 
}) => {
  const { isFieldRequired } = useFieldDependencies(formData, currentSection);
  const required = isFieldRequired(fieldName, baseRequired);
  
  return required ? (
    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
  ) : null;
};

export default useFieldDependencies;
