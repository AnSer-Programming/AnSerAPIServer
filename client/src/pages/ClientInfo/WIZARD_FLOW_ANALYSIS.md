# Wizard Flow Analysis & Recommendations

## Current Wizard Flow (As Implemented)

```
1. StartNewClient (Landing page)
   ↓
2. ClientSetUp (Company Info) → /company-info
   ↓
3. AnswerCallsNew (Call Categories) → /answer-calls
   ↓
4. OnCall (On-Call Setup) → /on-call
   ↓
5. CallRouting (Category Assignments) → /call-routing
   ↓
6. OfficeReach (Other Info) → /office-reach
   ↓
7. FinalDetails (Agreements & Signature) → /final-details
   ↓
8. ReviewStep (Review & Submit) → /review
```

## Navigation Analysis

### Active Pages (Currently Used):
- ✅ **StartNewClient.jsx** - Wizard entry point with "Fill Test Data (DEV)" button
- ✅ **ClientSetUp.jsx** - Company information, addresses, contacts, office hours
- ✅ **AnswerCallsNew.jsx** - Business type, call categories with detailed questions
- ✅ **OnCall.jsx** - Team members, escalation steps, schedules, contact rules
- ✅ **CallRouting.jsx** - Assigns categories to team members with escalation workflows
- ✅ **OfficeReach.jsx** - Additional office information, website access, consultation scheduling
- ✅ **FinalDetails.jsx** - Call volume metrics, final notes, terms, signature
- ✅ **ReviewStep.jsx** - Summary of all entered data with edit links

### Alternative/Unused Pages:
- ⚠️ **AnswerCallsReach.jsx** - Alternative implementation (route exists but not in main flow)
- ⚠️ **OnCallStreamlined.jsx** - Streamlined alternative (route exists but not in main flow)
- ⚠️ **AnswerCalls.jsx** - Old implementation (replaced by AnswerCallsNew.jsx)
- ❌ **CallVolume.jsx** - Standalone page (functionality now in FinalDetails)
- ❌ **ImprovementsDemo.jsx** - Demo/prototype page (not in production flow)
- ❌ **FastTrack.jsx** - Feature-flagged (env var: REACT_APP_FASTTRACK_ENABLED)

### Supporting Pages:
- ✅ **AdminInvite.jsx** - Invite system for admin users
- ✅ **InviteLinkHandler.jsx** - Handles invite link tokens

## Data Flow & Dependencies

### Test Data Coverage (from StartNewClient.jsx):

| Section | Fields Populated | Status |
|---------|-----------------|---------|
| **companyInfo** | 50+ fields | ✅ Complete |
| - Business details | Name, company, addresses | ✅ |
| - Contact channels | Phone, fax, website | ✅ |
| - Office hours | All 7 days + lunch | ✅ |
| - Summary preferences | Email, recap schedule | ✅ |
| **answerCalls** | 40+ fields | ✅ Complete |
| - Business type | Medical/Healthcare | ✅ |
| - Categories | 6 medical categories | ✅ |
| - Call types | 5 types (legacy) | ✅ |
| **onCall** | 40+ fields | ✅ Complete |
| - Team members | 4 members with contacts | ✅ |
| - Fixed order | 3-person escalation | ✅ |
| - Contact rules | Procedures, timing | ✅ |
| **callRouting** | 30+ fields | ✅ Complete |
| - Category assignments | All 6 categories | ✅ |
| - Escalation steps | Per-category workflows | ✅ |
| **metrics** | 4 fields | ✅ Complete |
| **finalDetails** | 4 fields | ✅ Complete |

### Section Dependencies:

```
answerCalls.categories
    ↓ (used by)
callRouting.categoryAssignments

onCall.team
    ↓ (used by)
callRouting.escalationSteps.contactPerson
onCall.fixedOrder
```

## Issues & Recommendations

### 1. Duplicate/Alternative Implementations

**Issue**: Multiple implementations of the same functionality create confusion and maintenance overhead.

**Files**:
- `AnswerCalls.jsx` (old) vs `AnswerCallsNew.jsx` (current)
- `OnCall.jsx` (full) vs `OnCallStreamlined.jsx` (alternative)
- `AnswerCallsNew.jsx` (categories) vs `AnswerCallsReach.jsx` (alternative)

**Recommendation**:
```
✅ KEEP: AnswerCallsNew.jsx, OnCall.jsx (these are actively used)
🗑️ REMOVE: AnswerCalls.jsx (old implementation)
📦 ARCHIVE: OnCallStreamlined.jsx, AnswerCallsReach.jsx (move to archive/ folder)
```

### 2. Legacy Data Structures

**Issue**: `answerCalls.callTypes` (lines 326-373 in test data) appears to be a legacy structure. The current UI uses `answerCalls.categories`.

**Evidence**:
- AnswerCallsNew.jsx reads/writes `section.categories` (line 78)
- CallRouting.jsx reads `answerCalls.categories` (line 89)
- Test data populates both `categories` AND `callTypes`

**Recommendation**:
```
🔍 INVESTIGATE: Check if callTypes is used anywhere
🗑️ CONSIDER REMOVING: If unused, remove from test data and schema
```

### 3. Standalone Pages Not in Flow

**Files**:
- `CallVolume.jsx` - Call volume metrics (this functionality is now in FinalDetails)
- `ImprovementsDemo.jsx` - Demo/prototype page

**Recommendation**:
```
🗑️ REMOVE: CallVolume.jsx (functionality merged into FinalDetails)
📦 ARCHIVE: ImprovementsDemo.jsx (move to archive/ or delete if obsolete)
```

### 4. Feature-Flagged Content

**File**: `FastTrack.jsx`

**Current State**: Only loads if `process.env.REACT_APP_FASTTRACK_ENABLED === 'true'`

**Recommendation**:
```
✅ KEEP: If feature is planned for future use
🗑️ REMOVE: If feature is abandoned/obsolete
```

### 5. Wizard Step Order

**routes.js order**:
```javascript
['company-info', 'answer-calls', 'on-call', 'call-routing', 'office-reach', 'final-details', 'review']
```

**Actual navigation flow**:
```
company-info → answer-calls → on-call → call-routing → office-reach → final-details → review
```

✅ **Status**: Matches perfectly - no changes needed

### 6. Missing Integration Point

**Issue**: CallRouting.jsx generates dispatch instructions but there's no clear way to export or use them.

**Evidence**:
- Line 289: `generateDispatchInstructions()` function exists
- Line 419: "PREVIEW DISPATCH INSTRUCTIONS" button
- No API call or download functionality visible

**Recommendation**:
```
🔍 VERIFY: Check if dispatch instructions are sent to backend on submit
📝 TODO: Add export/download functionality if not already present
```

## Recommended Actions

### Immediate Cleanup:

1. **Delete obsolete files**:
   ```bash
   # From client/src/pages/ClientInfo/pages/
   rm AnswerCalls.jsx
   rm CallVolume.jsx
   rm ImprovementsDemo.jsx
   ```

2. **Archive alternative implementations**:
   ```bash
   # Move to archive/ folder
   mv AnswerCallsReach.jsx archive/
   mv OnCallStreamlined.jsx archive/
   ```

3. **Update routes.js** - Remove references to archived files:
   ```javascript
   // Remove or comment out:
   ANSWER_CALLS_REACH: `${WIZARD_BASE}/answer-calls-reach`,
   ON_CALL_STREAMLINED: `${WIZARD_BASE}/on-call-streamlined`,
   ```

4. **Update ClientInfoReactRoutes.js** - Remove archived routes:
   ```javascript
   // Remove these lines:
   <Route path="/ClientInfoReact/NewFormWizard/answer-calls-reach" component={AnswerCallsReach} />
   <Route path="/ClientInfoReact/NewFormWizard/on-call-streamlined" component={OnCallStreamlined} />
   ```

### Future Improvements:

1. **Remove legacy callTypes** (if confirmed unused):
   - Remove from WizardContext.js defaults
   - Remove from test data (lines 326-373)
   - Update validation schemas

2. **Add dispatch instructions export**:
   - Add download button in CallRouting page
   - Format as PDF or text document
   - Include in final submission data

3. **Consolidate office hours logic**:
   - InfoPagePreview.jsx has `formatOfficeHours` helper (lines 25-65)
   - Consider moving to shared utils if used elsewhere

## Summary

### Current Status: ✅ Mostly Clean

The wizard flow is well-structured and logical. The main issues are:
- A few unused/obsolete files that should be removed
- Some alternative implementations that should be archived
- Legacy data structures (callTypes) that may be obsolete

### Files to Keep (8 core pages):
1. ✅ StartNewClient.jsx
2. ✅ ClientSetUp.jsx
3. ✅ AnswerCallsNew.jsx
4. ✅ OnCall.jsx
5. ✅ CallRouting.jsx
6. ✅ OfficeReach.jsx
7. ✅ FinalDetails.jsx
8. ✅ ReviewStep.jsx

### Files to Archive (2):
- AnswerCallsReach.jsx
- OnCallStreamlined.jsx

### Files to Delete (3):
- AnswerCalls.jsx (old implementation)
- CallVolume.jsx (functionality merged)
- ImprovementsDemo.jsx (prototype/demo)

**Overall Architecture**: 8/10 - Very good separation of concerns, clear data flow, comprehensive test data coverage.
