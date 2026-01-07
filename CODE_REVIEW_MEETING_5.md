# Code Review: Meeting 5 Requirements Implementation

**Date**: December 11, 2025  
**Reviewer**: GitHub Copilot AI Agent  
**Purpose**: Map Meeting 5 requirements to existing codebase components

---

## EXECUTIVE SUMMARY

### Files Requiring Modification: **7 files**
### New Files to Create: **1 file**
### Estimated Total Effort: **28-38 hours**

---

## DETAILED COMPONENT ANALYSIS

## 1. ON-CALL GROUP SECTION

### Current Implementation Review

**Primary File**: `client/src/pages/ClientInfo/pages/OnCall.jsx` (663 lines)

**Current Architecture**:
- Uses 8 sub-sections rendered via Accordion UI
- Sections: EnhancedOnCallTeamSection, OnCallRotationSection, OnCallContactRulesSection, OnCallProceduresSection, EscalationMatrixSection, OnCallDepartmentsSection, NotificationRulesSection, OnCallScheduleSection
- State managed in WizardContext under `onCall` key
- Complex DEFAULT_ONCALL structure (lines 60-103)

**Current Data Model** (lines 60-103):
```javascript
const DEFAULT_ONCALL = {
  rotation: {
    doesNotChange: false,        // ❌ REMOVE (Meeting req: remove this checkbox)
    otherExplain: '',
    whenChanges: '',
    frequency: '',
    changeBeginsTime: '',
    dayOrDate: '',
  },
  contactRules: { ... },
  procedures: { ... },
  team: [],                      // ✅ KEEP/ENHANCE
  // ... other fields
}
```

### Required Changes

#### 1.1 OnCallRotationSection.jsx (115 lines)

**File**: `client/src/pages/ClientInfo/sections/OnCallRotationSection.jsx`

**Current Issues Found**:
- Line 16: `const disabled = !!data.doesNotChange;` - controls disabling of fields
- Line 29-31: Checkbox for "On Call does not change" - **MUST REMOVE**
- Line 60: RadioGroup includes `value=""` with label "(None)" - **REMOVE THIS OPTION**
- Lines 16-31: Logic that disables right panel when checkbox is checked

**Required Changes**:
```jsx
// REMOVE THESE LINES (29-33):
<FormControlLabel
  control={
    <Checkbox
      checked={!!data.doesNotChange}
      onChange={(e) => set({ doesNotChange: e.target.checked })}
    />
  }
  label="On Call does not change"
/>

// REMOVE "(None)" option from RadioGroup (line 60):
<FormControlLabel value="" control={<Radio />} label="(None)" disabled={disabled} />

// REMOVE disabled logic - make fields always enabled
// DELETE line 16: const disabled = !!data.doesNotChange;
```

**Keep Lines 51-69**: Change cadence RadioGroup (Daily/Weekly/Monthly) ✅

#### 1.2 EnhancedOnCallTeamSection.jsx (919 lines)

**File**: `client/src/pages/ClientInfo/sections/EnhancedOnCallTeamSection.jsx`

**Current Implementation**:
- Lines 1-100: Complex team member management with escalation steps
- Supports multiple contact methods (email, cell, home, pager)
- Has escalation steps per member

**Required Enhancements**:
1. **Add team size question**: New field at top of component
   - "How many people are on the on-call team?"
   - Number input (1-20)
   
2. **Add role designation**: For each team member
   - Radio buttons: "Primary" or "Backup"
   - Add to data model: `role: 'primary' | 'backup'`

3. **Conditional email collection**:
   - Add top-level toggle: "Collect emails for message summaries and recaps?"
   - If YES: Show email field for each member
   - If NO: Hide email fields

**Data Model Changes Needed**:
```javascript
// Add to team member structure:
{
  id: generateId(),
  name: '',
  title: '',
  role: 'primary',        // NEW: 'primary' | 'backup'
  email: [''],           // Conditionally shown
  // ... existing fields
}

// Add to onCall state:
{
  teamSize: 0,                      // NEW
  collectEmailsForRecaps: false,   // NEW
  team: [],
  // ... existing fields
}
```

#### 1.3 NotificationRulesSection.jsx (50 lines)

**File**: `client/src/pages/ClientInfo/sections/NotificationRulesSection.jsx`

**Current Issues**:
- Entire section has notification toggles
- Meeting notes say: "Remove all When to ring - notification"

**Required Action**: 
- **REMOVE this entire component** from OnCall.jsx
- Delete import on line 48 of OnCall.jsx
- Remove from accordion list (lines 500+)

**Impact**: Low - clean removal, no dependencies

---

## 2. OFFICE REACH → OTHER INFO SECTION

### Current Implementation Review

**Primary File**: `client/src/pages/ClientInfo/pages/OfficeReach.jsx` (377 lines)

**Current Structure**:
- Three sub-sections: OfficeHoursSection, WebsiteAccessSection, SpecialEventsSection
- Title on line 177: "OFFICE REACH INFORMATION"
- Route: `/ClientInfoReact/NewFormWizard/office-reach`

### Required Changes

#### 2.1 Rename Section Throughout Application

**Files to Update** (grep found 20+ matches):

1. **OfficeReach.jsx** (line 54):
   ```javascript
   document.title = 'Office reach — AnSer Communications';
   // CHANGE TO:
   document.title = 'Other Info — AnSer Communications';
   ```

2. **OfficeReach.jsx** (line 177):
   ```jsx
   <Typography id="officereach-title" variant="h3" ...>
     OFFICE REACH INFORMATION
   </Typography>
   // CHANGE TO:
   <Typography id="otherinfo-title" variant="h3" ...>
     OTHER INFO
   </Typography>
   ```

3. **routes.js** (line 35):
   ```javascript
   'office-reach': 'Office Reach',
   // CHANGE TO:
   'office-reach': 'Other Info',
   ```

4. **ClientInfoNavbar.jsx** (lines 29, 36):
   ```javascript
   { label: 'OFFICE REACH INFORMATION', to: `${WIZARD_BASE}/office-reach` },
   { label: 'Office Reach', to: `${WIZARD_BASE}/office-reach` },
   // CHANGE TO:
   { label: 'OTHER INFO', to: `${WIZARD_BASE}/office-reach` },
   { label: 'Other Info', to: `${WIZARD_BASE}/office-reach` },
   ```

5. **OnCall.jsx** (lines 206, 634, 642):
   ```javascript
   // Comment: go to Office Reach
   // aria-label="Next: Office Reach"
   // Button text: "Next: Office Reach"
   // CHANGE ALL TO: "Other Info"
   ```

6. **StartNewClient.jsx** (line 80):
   ```javascript
   { icon: <TimerOutlined />, title: 'Office Reach', desc: '...' },
   // CHANGE TO:
   { icon: <TimerOutlined />, title: 'Other Info', desc: '...' },
   ```

**Total Files to Update for Rename**: 6 files, ~12 instances

#### 2.2 Add Business Hours Overflow Section

**Location**: Inside OfficeReach.jsx, after OfficeHoursSection

**New Component to Create**: `BusinessHoursOverflowSection.jsx`

```jsx
// NEW FILE: client/src/pages/ClientInfo/sections/BusinessHoursOverflowSection.jsx

import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';

export default function BusinessHoursOverflowSection({ data = {}, onChange, callTypes = [] }) {
  const handleChange = (field, value) => {
    onChange?.({ ...data, [field]: value });
  };

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#b00', mb: 2 }}>
        BUSINESS HOURS OVERFLOW
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>During business hours, route overflow calls to:</InputLabel>
        <Select
          value={data.overflowDestination || ''}
          onChange={(e) => handleChange('overflowDestination', e.target.value)}
          label="During business hours, route overflow calls to:"
        >
          <MenuItem value="">-- Select Destination --</MenuItem>
          {callTypes.map((type) => (
            <MenuItem key={type.id} value={type.name}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Are there any exceptions to these overflow rules?"
        value={data.overflowExceptions || ''}
        onChange={(e) => handleChange('overflowExceptions', e.target.value)}
        fullWidth
        multiline
        rows={3}
        helperText="Document any special cases or rule variations"
      />
    </Paper>
  );
}
```

**Integration into OfficeReach.jsx**:
- Import the new component
- Add after `<OfficeHoursSection />` (around line 200)
- Pass `callTypes` prop from existing call types data

#### 2.3 Add Daily Message Recap Section

**Location**: Inside OfficeReach.jsx, before SpecialEventsSection

**New Component to Create**: `DailyRecapSection.jsx`

```jsx
// NEW FILE: client/src/pages/ClientInfo/sections/DailyRecapSection.jsx

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Paper,
  Collapse,
} from '@mui/material';

export default function DailyRecapSection({ data = {}, onChange }) {
  const handleToggle = () => {
    onChange?.({
      ...data,
      wantsDailyRecap: !data.wantsDailyRecap,
      recapDeliveryMethod: data.wantsDailyRecap ? '' : data.recapDeliveryMethod,
    });
  };

  const handleMethodChange = (event) => {
    onChange?.({ ...data, recapDeliveryMethod: event.target.value });
  };

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#b00', mb: 2 }}>
        DAILY MESSAGE RECAP
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={!!data.wantsDailyRecap}
            onChange={handleToggle}
          />
        }
        label="Do you want a daily recap of all messages?"
      />

      <Collapse in={!!data.wantsDailyRecap}>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel>How would you like to receive it?</FormLabel>
          <RadioGroup
            value={data.recapDeliveryMethod || ''}
            onChange={handleMethodChange}
          >
            <FormControlLabel value="email" control={<Radio />} label="Email" />
            <FormControlLabel value="sms" control={<Radio />} label="SMS" />
            <FormControlLabel value="both" control={<Radio />} label="Both Email and SMS" />
            <FormControlLabel value="portal" control={<Radio />} label="Portal Notification" />
          </RadioGroup>
        </FormControl>
      </Collapse>
    </Paper>
  );
}
```

**Data Model Addition**:
```javascript
// Add to companyInfo in WizardContext:
{
  businessHoursOverflow: {
    overflowDestination: '',
    overflowExceptions: '',
  },
  dailyRecap: {
    wantsDailyRecap: false,
    recapDeliveryMethod: '', // 'email' | 'sms' | 'both' | 'portal'
  },
}
```

---

## 3. WEBSITE ACCESS SECTION

### Current Implementation Review

**File**: `client/src/pages/ClientInfo/sections/WebsiteAccessSection.jsx` (362 lines)

**Current Complexity**:
- Lines 22-38: Complex `defaultState` with 10 fields
- Lines 96-362: Multiple configuration options
  - requiresLogin (yes/no)
  - requiresMFA (yes/no)
  - hasMFA, hasCAPTCHA, autoLogoutAggressive flags
  - Multiple site entries with URL/username/password
  - Difficulty assessment
  - Test completion tracking

**Meeting Requirement**: "only keep Yes or No"

### Required Simplification

**DRASTIC REDUCTION** from 362 lines to ~50 lines

**New Simplified Component**:
```jsx
// REPLACE WebsiteAccessSection.jsx ENTIRELY

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

export default function WebsiteAccessSection() {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const websiteAccessEnabled = companyInfo.websiteAccess?.required || false;

  const handleToggle = () => {
    updateSection('companyInfo', {
      websiteAccess: {
        required: !websiteAccessEnabled,
      },
    });
  };

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#b00', mb: 1 }}>
        WEBSITE ACCESS
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={websiteAccessEnabled}
            onChange={handleToggle}
          />
        }
        label="Does your team use a website during calls?"
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        If yes, our team will need access credentials. These will be collected during account setup.
      </Typography>
    </Paper>
  );
}
```

**Impact**: 
- Remove 310+ lines of code
- Simplified data model (boolean only)
- Validation becomes trivial
- No eslint-disable needed

---

## 4. CALL FILTERING SECTION (NEW)

### Implementation Plan

**New File to Create**: `client/src/pages/ClientInfo/sections/CallFilteringSection.jsx`

**Component Structure**:
```jsx
// NEW FILE: client/src/pages/ClientInfo/sections/CallFilteringSection.jsx

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Paper,
  Collapse,
  Alert,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const MAX_GREETING_LENGTH = 250;
const MAX_CHECKIN_LENGTH = 150;

export default function CallFilteringSection() {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const cf = companyInfo.callFiltering || {
    roboCallBlocking: false,
    roboCallGreeting: '',
    businessGreeting: false,
    businessGreetingText: '',
    checkinRecording: false,
    checkinMessage: '',
  };

  const updateCF = (patch) => {
    updateSection('companyInfo', {
      callFiltering: { ...cf, ...patch },
    });
  };

  // Q1 Toggle
  const handleQ1Toggle = () => {
    const newValue = !cf.roboCallBlocking;
    updateCF({
      roboCallBlocking: newValue,
      roboCallGreeting: newValue ? cf.roboCallGreeting : '',
      // If enabling Q1, disable Q2
      businessGreeting: newValue ? false : cf.businessGreeting,
      businessGreetingText: newValue ? '' : cf.businessGreetingText,
    });
  };

  // Q2 Toggle (only available when Q1 is off)
  const handleQ2Toggle = () => {
    updateCF({
      businessGreeting: !cf.businessGreeting,
      businessGreetingText: !cf.businessGreeting ? cf.businessGreetingText : '',
    });
  };

  // Q3 Toggle
  const handleQ3Toggle = () => {
    updateCF({
      checkinRecording: !cf.checkinRecording,
      checkinMessage: !cf.checkinRecording ? cf.checkinMessage : '',
    });
  };

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#b00', mb: 1 }}>
        CALL FILTERING
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure call screening and greeting options to improve call quality
      </Typography>

      {/* Question 1: Robo-Call Blocking */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={!!cf.roboCallBlocking}
              onChange={handleQ1Toggle}
            />
          }
          label="Add a greeting that requires caller to press 5 to block robo-calls?"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
          Helps block automated robo-calls
        </Typography>

        <Collapse in={!!cf.roboCallBlocking}>
          <TextField
            label="What should the greeting say?"
            value={cf.roboCallGreeting || ''}
            onChange={(e) => updateCF({ roboCallGreeting: e.target.value })}
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2, ml: 4 }}
            placeholder="You've reached [Business Name]. To speak with a representative, please press 5."
            inputProps={{ maxLength: MAX_GREETING_LENGTH }}
            helperText={`${cf.roboCallGreeting?.length || 0}/${MAX_GREETING_LENGTH} characters`}
            required
          />
        </Collapse>
      </Box>

      {/* Question 2: Business Greeting (only if Q1 is NO) */}
      {!cf.roboCallBlocking && (
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!cf.businessGreeting}
                onChange={handleQ2Toggle}
              />
            }
            label="Add a greeting so caller knows they reached your business?"
          />

          <Collapse in={!!cf.businessGreeting}>
            <TextField
              label="What should the greeting say?"
              value={cf.businessGreetingText || ''}
              onChange={(e) => updateCF({ businessGreetingText: e.target.value })}
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 2, ml: 4 }}
              placeholder="Thank you for calling [Business Name]. Please hold while we connect you."
              inputProps={{ maxLength: MAX_GREETING_LENGTH }}
              helperText={`${cf.businessGreetingText?.length || 0}/${MAX_GREETING_LENGTH} characters`}
              required
            />
          </Collapse>
        </Box>
      )}

      {/* Question 3: Check-in Recording */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={!!cf.checkinRecording}
              onChange={handleQ3Toggle}
            />
          }
          label="Add a 'check-in' recording for when system is busy?"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
          This message plays periodically when caller is on hold during high volume
        </Typography>

        <Collapse in={!!cf.checkinRecording}>
          <TextField
            label="What should the check-in message say?"
            value={cf.checkinMessage || ''}
            onChange={(e) => updateCF({ checkinMessage: e.target.value })}
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2, ml: 4 }}
            placeholder="We're still working to connect you. Please continue holding."
            inputProps={{ maxLength: MAX_CHECKIN_LENGTH }}
            helperText={`${cf.checkinMessage?.length || 0}/${MAX_CHECKIN_LENGTH} characters (shorter message, repeats)`}
            required
          />
        </Collapse>
      </Box>

      {cf.roboCallBlocking && cf.businessGreeting && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Note: Robo-call blocking greeting will play instead of business greeting when both are enabled.
        </Alert>
      )}
    </Paper>
  );
}
```

**Integration**: Add to OfficeReach.jsx after WebsiteAccessSection

**Validation Schema Addition**:
```javascript
// Add to validationSchema.js

export const callFilteringSchema = (data = {}) => {
  const errors = {};
  
  if (data.roboCallBlocking && !data.roboCallGreeting?.trim()) {
    errors.roboCallGreeting = 'Greeting text is required when robo-call blocking is enabled';
  }
  
  if (data.businessGreeting && !data.businessGreetingText?.trim()) {
    errors.businessGreetingText = 'Greeting text is required when business greeting is enabled';
  }
  
  if (data.checkinRecording && !data.checkinMessage?.trim()) {
    errors.checkinMessage = 'Check-in message is required when check-in recording is enabled';
  }
  
  if (data.roboCallGreeting?.length > 250) {
    errors.roboCallGreeting = 'Greeting must be 250 characters or less';
  }
  
  if (data.businessGreetingText?.length > 250) {
    errors.businessGreetingText = 'Greeting must be 250 characters or less';
  }
  
  if (data.checkinMessage?.length > 150) {
    errors.checkinMessage = 'Check-in message must be 150 characters or less';
  }
  
  return Object.keys(errors).length ? errors : null;
};
```

---

## 5. WIZARDCONTEXT DATA MODEL UPDATES

**File**: `client/src/pages/ClientInfo/context_API/WizardContext.js` (948 lines)

**Required Additions to DEFAULTS**:

```javascript
// In WizardContext DEFAULTS object, add to companyInfo:

companyInfo: {
  // ... existing fields ...
  
  // NEW: Business Hours Overflow
  businessHoursOverflow: {
    overflowDestination: '',
    overflowExceptions: '',
  },
  
  // NEW: Daily Recap
  dailyRecap: {
    wantsDailyRecap: false,
    recapDeliveryMethod: '', // 'email' | 'sms' | 'both' | 'portal'
  },
  
  // NEW: Call Filtering
  callFiltering: {
    roboCallBlocking: false,
    roboCallGreeting: '',
    businessGreeting: false,
    businessGreetingText: '',
    checkinRecording: false,
    checkinMessage: '',
  },
  
  // MODIFIED: Website Access (simplified)
  websiteAccess: {
    required: false, // Simple boolean, remove all other fields
  },
},

// In onCall:
onCall: {
  // NEW fields:
  teamSize: 0,
  collectEmailsForRecaps: false,
  
  // REMOVE from rotation:
  rotation: {
    // doesNotChange: false,  // ❌ REMOVE THIS
    otherExplain: '',
    whenChanges: '',
    frequency: '',
    changeBeginsTime: '',
    dayOrDate: '',
  },
  
  // ... rest unchanged
}
```

---

## 6. VALIDATION UPDATES

**File**: `client/src/pages/ClientInfo/utils/validationSchema.js` (1063 lines)

### Updates Needed:

1. **Remove** `doesNotChange` validation from onCall rotation schema
2. **Simplify** websiteAccess schema (lines 224+)
3. **Add** callFiltering validation (see section 4 above)
4. **Add** businessHoursOverflow validation
5. **Add** dailyRecap validation

---

## 7. ROUTING & NAVIGATION

**No route changes needed** - All modifications are within existing pages.

**Files that reference "Office Reach" text** (cosmetic updates only):
- OnCall.jsx (lines 206, 634, 642)
- CallVolume.jsx (line 126)
- StartNewClient.jsx (line 80)
- ClientInfoNavbar.jsx (lines 29, 36)
- constants/routes.js (line 35)

---

## 8. IMPLEMENTATION CHECKLIST

### Phase 1: On-Call Modifications (10-12 hours)

- [ ] **OnCallRotationSection.jsx**
  - [ ] Remove "On Call does not change" checkbox (lines 29-33)
  - [ ] Remove "(None)" option from frequency RadioGroup (line 60)
  - [ ] Remove `disabled` logic (line 16)
  - [ ] Remove all disabled={disabled} props
  - [ ] Test that change cadence section always enabled

- [ ] **EnhancedOnCallTeamSection.jsx**
  - [ ] Add team size number field at top
  - [ ] Add role selection (Primary/Backup) for each member
  - [ ] Add "Collect emails for recaps?" toggle
  - [ ] Conditionally show/hide email fields based on toggle
  - [ ] Update normalizeMember function to include role
  - [ ] Update data model in component

- [ ] **OnCall.jsx**
  - [ ] Remove NotificationRulesSection import (line 48)
  - [ ] Remove NotificationRulesSection from accordion
  - [ ] Update DEFAULT_ONCALL to remove doesNotChange
  - [ ] Add teamSize and collectEmailsForRecaps fields
  - [ ] Change "Next: Office Reach" to "Next: Other Info" (3 places)

- [ ] **WizardContext.js**
  - [ ] Add teamSize: 0 to onCall DEFAULTS
  - [ ] Add collectEmailsForRecaps: false
  - [ ] Remove doesNotChange from rotation DEFAULTS

### Phase 2: Office Reach → Other Info (8-10 hours)

- [ ] **Rename throughout app** (6 files, ~12 instances)
  - [ ] OfficeReach.jsx: title and document.title
  - [ ] constants/routes.js: route label
  - [ ] ClientInfoNavbar.jsx: nav labels (2 places)
  - [ ] OnCall.jsx: button text and comments (3 places)
  - [ ] CallVolume.jsx: button text
  - [ ] StartNewClient.jsx: card title

- [ ] **Create BusinessHoursOverflowSection.jsx**
  - [ ] New component with dropdown and exceptions field
  - [ ] Import into OfficeReach.jsx
  - [ ] Add after OfficeHoursSection
  - [ ] Wire up to companyInfo.businessHoursOverflow

- [ ] **Create DailyRecapSection.jsx**
  - [ ] New component with toggle and conditional radio buttons
  - [ ] Import into OfficeReach.jsx
  - [ ] Add before SpecialEventsSection
  - [ ] Wire up to companyInfo.dailyRecap

- [ ] **Update WizardContext.js**
  - [ ] Add businessHoursOverflow to DEFAULTS
  - [ ] Add dailyRecap to DEFAULTS

### Phase 3: Website Access Simplification (3-4 hours)

- [ ] **WebsiteAccessSection.jsx**
  - [ ] REPLACE entire file (save backup first)
  - [ ] New version: 50 lines, simple Yes/No toggle
  - [ ] Remove all complexity (MFA, CAPTCHA, difficulty, etc.)
  - [ ] Update data model to simple boolean

- [ ] **WizardContext.js**
  - [ ] Simplify websiteAccess DEFAULTS to { required: false }

- [ ] **validationSchema.js**
  - [ ] Simplify websiteAccess schema (if any exists)

### Phase 4: Call Filtering (New Feature) (8-10 hours)

- [ ] **Create CallFilteringSection.jsx**
  - [ ] Implement Q1: Robo-call blocking with text input
  - [ ] Implement Q2: Business greeting (conditional on Q1=NO)
  - [ ] Implement Q3: Check-in recording
  - [ ] Add character count helpers
  - [ ] Add mutual exclusion logic for Q1/Q2
  - [ ] Add Collapse animations

- [ ] **Integrate into OfficeReach.jsx**
  - [ ] Import CallFilteringSection
  - [ ] Add after WebsiteAccessSection
  - [ ] Test rendering and state updates

- [ ] **WizardContext.js**
  - [ ] Add callFiltering to companyInfo DEFAULTS

- [ ] **validationSchema.js**
  - [ ] Create callFilteringSchema function
  - [ ] Add to validators.js export
  - [ ] Validate required text when toggles are ON
  - [ ] Validate character limits

### Phase 5: Testing & QA (5-6 hours)

- [ ] **Unit Tests**
  - [ ] Test OnCall team size/role selection
  - [ ] Test conditional email display
  - [ ] Test Call Filtering Q1/Q2 mutual exclusion
  - [ ] Test character limits

- [ ] **Integration Tests**
  - [ ] Test full wizard flow with new fields
  - [ ] Test data persistence across pages
  - [ ] Test validation on submit

- [ ] **Manual QA**
  - [ ] Verify all "Office Reach" renamed to "Other Info"
  - [ ] Verify "On Call does not change" removed
  - [ ] Verify "(None)" option removed
  - [ ] Verify change cadence always enabled
  - [ ] Verify notification section removed
  - [ ] Verify new sections appear correctly
  - [ ] Test on mobile/responsive
  - [ ] Accessibility testing

---

## 9. FILES SUMMARY

### Files to Modify: 7
1. `client/src/pages/ClientInfo/sections/OnCallRotationSection.jsx` - Remove checkbox and "(None)"
2. `client/src/pages/ClientInfo/sections/EnhancedOnCallTeamSection.jsx` - Add team size, roles, email toggle
3. `client/src/pages/ClientInfo/pages/OnCall.jsx` - Remove NotificationRulesSection, update text
4. `client/src/pages/ClientInfo/pages/OfficeReach.jsx` - Add new sections, rename
5. `client/src/pages/ClientInfo/sections/WebsiteAccessSection.jsx` - Complete rewrite (simplify)
6. `client/src/pages/ClientInfo/context_API/WizardContext.js` - Add new fields to DEFAULTS
7. `client/src/pages/ClientInfo/utils/validationSchema.js` - Update schemas

### Files to Create: 3
1. `client/src/pages/ClientInfo/sections/BusinessHoursOverflowSection.jsx` - NEW
2. `client/src/pages/ClientInfo/sections/DailyRecapSection.jsx` - NEW
3. `client/src/pages/ClientInfo/sections/CallFilteringSection.jsx` - NEW

### Files Requiring Rename Updates: 6
- OfficeReach.jsx
- constants/routes.js
- ClientInfoNavbar.jsx
- OnCall.jsx
- CallVolume.jsx
- StartNewClient.jsx

### Files to Delete: 0
- NotificationRulesSection.jsx can stay but remove from imports

---

## 10. RISK ASSESSMENT

### High Risk:
- **WebsiteAccessSection complete rewrite**: May break existing data
  - **Mitigation**: Create migration script for existing records
  - **Test**: Verify old data displays correctly after change

### Medium Risk:
- **OnCall data model changes**: Removing doesNotChange may affect saved data
  - **Mitigation**: Add migration logic in WizardContext
- **Call Filtering is new**: No existing patterns to follow
  - **Mitigation**: Follow existing section patterns closely

### Low Risk:
- Renaming "Office Reach" to "Other Info" (cosmetic only)
- Removing NotificationRulesSection (clean removal)
- Adding new optional sections (won't break existing)

---

## 11. ESTIMATED EFFORT BREAKDOWN

| Task | Hours | Priority |
|------|-------|----------|
| On-Call modifications | 10-12 | HIGH |
| Office Reach rename + new sections | 8-10 | HIGH |
| Website Access simplification | 3-4 | MEDIUM |
| Call Filtering creation | 8-10 | MEDIUM |
| Testing & QA | 5-6 | HIGH |
| **TOTAL** | **34-42 hours** | |

---

## 12. NEXT STEPS

1. **Review this document with team** - Get approval on approach
2. **Create feature branch**: `feature/meeting-5-onboarding-updates`
3. **Start with Phase 1** (On-Call) - highest impact
4. **Daily check-ins** during implementation
5. **Code review** before merging each phase

---

## END OF CODE REVIEW

**Document Version**: 1.0  
**Last Updated**: December 11, 2025  
**Status**: Ready for Implementation
