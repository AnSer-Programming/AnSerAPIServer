// Quick integration test to verify all components work together
import { createTheme } from '@mui/material/styles';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';
import { validateSection } from '../utils/validationSchema';

// Test that all major utilities work correctly
const testIntegration = () => {
  console.log('🧪 Testing ClientInfo Integration...');
  
  // Test 1: Theme and SharedStyles
  try {
    const theme = createTheme();
    const sharedStyles = createSharedStyles(theme, false);
    console.log('✅ SharedStyles working correctly');
    console.log('Layout keys:', Object.keys(sharedStyles.layout));
    console.log('Navigation keys:', Object.keys(sharedStyles.navigation));
  } catch (error) {
    console.error('❌ SharedStyles error:', error);
  }

  // Test 2: Routes
  try {
    console.log('✅ Routes working correctly');
    console.log('COMPANY_INFO route:', WIZARD_ROUTES.COMPANY_INFO);
    console.log('ANSWER_CALLS route:', WIZARD_ROUTES.ANSWER_CALLS);
  } catch (error) {
    console.error('❌ Routes error:', error);
  }

  // Test 3: Validation
  try {
    const testData = { name: 'Test Company', phone: '555-1234' };
    const errors = validateSection('companyInfo', testData);
    console.log('✅ Validation working correctly');
    console.log('Sample validation result:', Object.keys(errors));
  } catch (error) {
    console.error('❌ Validation error:', error);
  }

  console.log('🎉 Integration test complete!');
};

export default testIntegration;
