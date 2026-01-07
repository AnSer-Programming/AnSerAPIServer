# Meeting 5 Onboarding - Analysis & Requirements Report

## Executive Summary

This document provides a comprehensive analysis of Meeting 5 onboarding notes and translates the requirements into actionable development tasks for the AnSer API Client Wizard interface.

---

## 1. ON-CALL GROUP SECTION

### Current Issues Identified:
- Right side of On-Call interface is enabled when it should be disabled/grayed out
- "On Call does not change" checkbox exists and should be removed
- "None" appears as an option and should be removed
- Notification/ring settings are present and should be removed

### Required Changes:

#### A. UI Simplification
1. **Disable Right Panel**: Gray out/disable the right side configuration panel initially
2. **Remove "On Call Does Not Change" Box**: This checkbox should be completely removed from the interface
3. **Remove "None" Option**: Eliminate "None" from dropdown selections
4. **Remove Notification Settings**: Delete all "When to ring" and notification-related fields

#### B. Workflow Redesign
The new workflow should follow this structure:

**Step 1: Team Size**
- Ask: "How many people are on the on-call team?"
- Input: Number field (integer)

**Step 2: Team Member Roles**
- For each person, ask:
  - Name
  - Role designation: "Primary" or "Backup"
  
**Step 3: Contact Information**
- Question: "Do we need to collect email addresses for message summaries and recaps?"
- If YES: Show email field for each team member
- Purpose: For sending daily recaps and message summaries

#### C. What to Keep
- **Change Cadence**: Keep this section and the 3 lines/options below it
- These settings control rotation schedules

---

## 2. OFFICE REACH SECTION → "OTHER INFO"

### Section Rename
- **Old Name**: "Office Reach"
- **New Name**: "Other Info"

### Subsection 1: Business Hours Overflow

#### Display Label
"Business Hours Overflow" or simply "Overflow"

#### Configuration Questions

**Question 1**: "During business hours, what should happen with overflow calls?"
- **UI Element**: Dropdown selector
- **Options**: Use existing call types from the system
- **Purpose**: Define where overflow calls route during business hours

**Question 2**: "Are there any exceptions to these overflow rules?"
- **UI Element**: Conditional text area or exception builder
- **Display Logic**: Show UNDER the office hours section (not separate)
- **Purpose**: Document special cases or rule variations

### Subsection 2: Daily Message Recap

**Question**: "Do you want a daily recap of all messages?"
- **UI Element**: Yes/No toggle
- **Conditional Display**: ONLY show follow-up question if answered YES

**Follow-up Question** (if YES): "How would you like to receive it?"
- **Options**: 
  - Email
  - SMS
  - Both
  - Portal notification

**Alternative Phrasing**: "Do you want a summary of your messages?"
- (Same as "daily recap" - choose one consistent terminology)

---

## 3. WEBSITE ACCESS SECTION

### Simplification Required

#### Current State
Multiple options/fields exist for website access configuration

#### Required Change
**Reduce to Binary Choice**:
- Option 1: **Yes**
- Option 2: **No**

**No additional fields or configuration options needed**

---

## 4. NEW SECTION: CALL FILTERING

### Section Details
- **Category Name**: "Call Filtering"
- **Purpose**: Configure call screening and greeting options
- **Location**: Add as new section in the wizard flow

### Question 1: Robo-Call Blocking

**Question**: "Do you want us to add a greeting recording that requires the caller to press 5 before it reaches us?"

**Purpose**: Blocks automated robo-calls

**UI Elements**:
- Toggle: Yes/No
- **Conditional Field** (if YES): 
  - Text input: "What should the greeting say?"
  - Example: "You've reached [Business Name]. To speak with a representative, please press 5."
  - Max length: 250 characters

**Logic Note**: If answered YES to Question 1, skip Question 2 (they're mutually exclusive)

### Question 2: Business Greeting

**Question**: "Do you want a greeting so that the caller knows they are calling your business?"

**Display Logic**: 
- **Only show if Question 1 was answered NO**
- If Question 1 = YES, hide this question entirely

**UI Elements**:
- Toggle: Yes/No
- **Conditional Field** (if YES):
  - Text input: "What should the greeting say?"
  - Example: "Thank you for calling [Business Name]. Please hold while we connect you."
  - Max length: 250 characters

### Question 3: Check-in Recording

**Question**: "Do you want a 'check-in' recording so that the caller knows we are still trying to answer their call?"

**Context**: This recording only plays when the system is busy/experiencing delays

**UI Elements**:
- Toggle: Yes/No
- **Conditional Field** (if YES):
  - Text input: "What should the check-in message say?"
  - Example: "We're still working to connect you with a representative. Please continue holding."
  - Max length: 150 characters
  - Note: This is a shorter message since it repeats

**System Behavior**: 
- Only triggers during high call volume
- Plays at intervals (e.g., every 30 seconds) when hold time exceeds threshold

---

## 5. ADDITIONAL CONTEXT NOTES

### Holiday Greetings System
**Reference**: "Holiday greetings - auto answer - miteam web"

**Interpretation**: 
- Existing holiday greeting system exists
- May integrate with MiTeam web platform
- Auto-answer functionality available
- **Action**: Verify if Call Filtering section needs integration with existing holiday greeting system

---

## 6. IMPLEMENTATION PRIORITY

### Phase 1 - Critical Changes (Immediate)
1. On-Call Group simplification (remove boxes, disable right panel)
2. Office Reach → Other Info rename
3. Website Access simplification (Yes/No only)

### Phase 2 - Workflow Improvements (Next Sprint)
4. On-Call team size and role workflow
5. Business Hours Overflow configuration
6. Daily recap conditional logic

### Phase 3 - New Features (Following Sprint)
7. Call Filtering section (all 3 questions)
8. Greeting message text inputs
9. Integration testing with existing holiday system

---

## 7. TECHNICAL CONSIDERATIONS

### Component Files to Modify

Based on the codebase structure:

1. **On-Call Section**:
   - `client/src/pages/ClientInfo/pages/OnCall.jsx`
   - `client/src/pages/ClientInfo/pages/OnCallStreamlined.jsx`
   - WizardContext state updates needed

2. **Office Reach / Other Info**:
   - Locate OfficeReach component (likely in pages directory)
   - Rename component and route
   - Update navigation labels

3. **Website Access**:
   - `client/src/pages/ClientInfo/sections/WebsiteAccessSection.jsx` (likely)
   - Simplify to single boolean field

4. **Call Filtering** (New):
   - Create new component: `CallFilteringSection.jsx`
   - Add to wizard flow routing
   - Update validation schema for conditional fields

### State Management

Add to WizardContext DEFAULTS:
```javascript
callFiltering: {
  roboCallBlocking: false,
  roboCallGreeting: '',
  businessGreeting: false,
  businessGreetingText: '',
  checkinRecording: false,
  checkinMessage: ''
}
```

### Validation Rules

- All greeting text fields: max 250 chars (150 for check-in)
- Greeting text required when toggle is YES
- Question 2 only validates if Question 1 is NO

---

## 8. USER FLOW DIAGRAMS

### On-Call Revised Flow
```
1. How many people? [Number Input]
   ↓
2. For each person:
   - Name: [Text Input]
   - Role: [Primary / Backup]
   ↓
3. Need emails for recaps? [Yes/No]
   → If Yes: Show email field for each person
   ↓
4. Change Cadence [Keep existing]
```

### Call Filtering Flow
```
Start → Q1: Robo-call blocking? 
        ├─ YES → Enter greeting text → END
        └─ NO → Q2: Business greeting?
                ├─ YES → Enter greeting text
                └─ NO → (continue)
        ↓
Q3: Check-in recording?
    ├─ YES → Enter check-in message
    └─ NO → (continue)
```

---

## 9. QUESTIONS FOR CLARIFICATION

1. **On-Call Email Collection**: Should email be required or optional once the toggle is YES?

2. **Overflow Rules Exceptions**: What format should exceptions take? Free text or structured input?

3. **Call Filtering Priority**: Should there be a default/recommended configuration for first-time users?

4. **Holiday Integration**: Should Call Filtering greetings override or complement holiday greetings?

5. **Change Cadence Details**: What are "the 3 lines below it" that should be kept? Need specific field names.

---

## 10. ACCEPTANCE CRITERIA

### On-Call Group
- [ ] Right panel is disabled/grayed out initially
- [ ] "On Call does not change" checkbox removed
- [ ] "None" option removed from all dropdowns
- [ ] All notification/ring settings removed
- [ ] Team size question added
- [ ] Primary/Backup role selection works for each member
- [ ] Email collection conditional logic works
- [ ] Change cadence section preserved

### Other Info (formerly Office Reach)
- [ ] Section renamed throughout application
- [ ] Business Hours Overflow dropdown populated with call types
- [ ] Exceptions field displays under office hours
- [ ] Daily recap conditional display works correctly
- [ ] "How would you like it" only shows when recap = YES

### Website Access
- [ ] Only Yes/No options available
- [ ] All extra fields removed
- [ ] Validation updated accordingly

### Call Filtering
- [ ] New section added to wizard
- [ ] Q1 displays with conditional text input
- [ ] Q2 only shows when Q1 = NO
- [ ] Q2 has conditional text input
- [ ] Q3 displays independently
- [ ] Q3 has conditional text input (shorter max length)
- [ ] All character limits enforced
- [ ] Required field validation works

---

## 11. ESTIMATED EFFORT

- **On-Call Modifications**: 8-12 hours
- **Office Reach Rename & Logic**: 4-6 hours
- **Website Access Simplification**: 2-3 hours
- **Call Filtering Section (New)**: 10-15 hours
- **Testing & QA**: 8-10 hours
- **Total Estimated**: 32-46 hours (4-6 business days)

---

## End of Report

**Report Generated**: December 11, 2025  
**Based On**: Meeting 5 Onboarding Notes  
**Next Steps**: Review with team, prioritize implementation, create Jira tickets
