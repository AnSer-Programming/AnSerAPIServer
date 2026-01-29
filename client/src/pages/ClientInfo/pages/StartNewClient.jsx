import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  BusinessOutlined,
  PhoneOutlined,
  ScheduleOutlined,
  EventOutlined,
  ReviewsOutlined,
  CheckCircleOutlined,
  TimerOutlined,
  GroupOutlined,
  AccountTreeOutlined,
  PlayArrowRounded,
  RouteOutlined,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
// Navbar handled by WizardLayout
// Footer handled by WizardLayout
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';

// Import AnSer logo
import AnSerLogoStar from '../../../assets/img/ClientInfo/AnSerLogoStar.png';
import logger from '../utils/logger';

const StartNewClient = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const theme = useTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingMode, setLoadingMode] = useState(null);
  const isLoading = Boolean(loadingMode);
  const { updateSection, formData, restoreFormData } = useWizard();
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState(null);

  useEffect(() => {
    // Check for existing draft in localStorage
    const draft = localStorage.getItem('clientWizardDraft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Check if draft has meaningful data (not just empty defaults)
        const hasData = Object.values(parsedDraft.formData || {}).some(section => {
          if (typeof section === 'object' && section !== null) {
            return Object.values(section).some(val => {
              if (Array.isArray(val)) return val.length > 0;
              if (typeof val === 'string') return val.trim().length > 0;
              if (typeof val === 'boolean') return val === true;
              return false;
            });
          }
          return false;
        });

        if (hasData) {
          setDraftTimestamp(new Date().toLocaleString());
          setShowRestoreDialog(true);
        }
      } catch (e) {
        logger.warn('Failed to parse draft:', e);
      }
    }

    const prevTitle = document.title;
    document.title = 'Start client setup — AnSer Communications';

    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      created = true;
    }
    meta.content = "Set up professional call handling for your business with AnSer — quick, easy, and customizable.";
    if (created) document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  const handleRestoreDraft = async () => {
    setShowRestoreDialog(false);
    setLoadingMode('restore');
    const draft = localStorage.getItem('clientWizardDraft');
    if (draft && typeof restoreFormData === 'function') {
      restoreFormData(draft);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    history.push(WIZARD_ROUTES.COMPANY_INFO);
  };

  const handleStartFresh = () => {
    setShowRestoreDialog(false);
    localStorage.removeItem('clientWizardDraft');
    handleStart();
  };

  const handleStart = async () => {
    setLoadingMode('standard');
    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    history.push(WIZARD_ROUTES.COMPANY_INFO);
  };

  const handleFillTestData = async () => {
    setLoadingMode('test');

    // Generate test data
    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Company Info - Comprehensive
    updateSection('companyInfo', {
      businessName: 'ABC Medical Clinic',
      company: 'ABC Medical Group LLC',
      physicalLocation: '123 Main Street',
      suiteOrUnit: 'Suite 100',
      physicalCity: 'Seattle',
      physicalState: 'WA',
      physicalPostalCode: '98101',
      billingAddress: '456 Corporate Plaza',
      billingSuite: 'Floor 3',
      billingCity: 'Seattle',
      billingState: 'WA',
      billingPostalCode: '98102',
      billingSameAsPhysical: false,
      additionalLocations: [],
      contactNumbers: {
        primaryOfficeLine: '206-555-1234',
        tollFree: '1-800-555-1234',
        secondaryLine: '206-555-1235',
        fax: '206-555-1236',
        officeEmail: 'info@abcmedical.com',
        website: 'www.abcmedical.com',
      },
      contactChannels: [
        { id: generateId(), type: 'phone', value: '206-555-1234' },
        { id: generateId(), type: 'toll-free', value: '1-800-555-1234' },
        { id: generateId(), type: 'fax', value: '206-555-1236' },
        { id: generateId(), type: 'website', value: 'www.abcmedical.com' },
      ],
      primaryContact: {
        name: 'Dr. Sarah Johnson',
        title: 'Primary Physician',
        phone: '206-555-2001',
        email: 'sarah.johnson@abcmedical.com',
      },
      billingContact: {
        name: 'Lisa Park',
        title: 'Office Manager',
        phone: '206-555-2004',
        email: 'lisa.park@abcmedical.com',
        purchaseOrder: 'PO-2024-001',
        notes: 'Net 30 payment terms',
      },
      billingSameAsPrimary: false,
      timeZone: 'PST',
      officeHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '13:00', closed: false },
        sunday: { open: '09:00', close: '13:00', closed: true },
      },
      lunchHours: { enabled: true, open: '12:00', close: '13:00' },
      plannedTimes: {
        allDay: false,
        outsideBusiness: true,
        overflow: true,
        lunch: true,
        emergency: true,
        other: false,
        holidays: {
          newYears: true,
          thanksgiving: true,
          christmas: true,
          otherHolidays: false,
          customDates: [],
        },
      },
      emergencyProtocols: {
        weather: { enabled: true },
        power: { enabled: true },
        phone: { enabled: false },
        internet: { enabled: false },
      },
      holidays: ['01/01/2025', '11/28/2025', '12/25/2025'],
      specialEvents: [],
      callFiltering: {
        roboCallBlocking: true,
        businessGreeting: true,
        checkInRecording: false,
      },
      businessHoursOverflow: {
        enabled: true,
        overflowNumber: '206-555-1237',
        ringCount: '4',
      },
      dailyRecap: {
        enabled: true,
        deliveryTime: '17:00',
        deliveryMethod: 'email',
        emailAddress: 'recap@abcmedical.com',
        includeDetails: true,
      },
      websiteAccess: {
        required: false,
        requiresLogin: false,
        requiresMFA: false,
        difficulty: 'easy',
        sites: [],
        hasCAPTCHA: false,
        autoLogoutAggressive: false,
        testComplete: false,
        missingInfo: false,
      },
      consultationMeeting: {
        selectedDateTimes: [],
        meetingType: 'video',
        notes: 'Prefer afternoon meetings',
        contactPerson: 'Dr. Sarah Johnson',
        contactEmail: 'sarah.johnson@abcmedical.com',
        contactPhone: '206-555-2001',
      },
      summaryPreferences: {
        emailEnabled: true,
        faxEnabled: false,
        email: 'recap@abcmedical.com',
        faxNumber: '',
        alwaysSendEvenIfNoMessages: true,
        reportSpamHangups: false,
        dailyRecapEnabled: true,
        realTimeChannels: ['email'],
        recap: {
          includeNoMessages: true,
          delivery: { email: true, fax: false, other: false },
          otherNotes: '',
        },
        recapSchedule: {
          monday: { enabled: true, times: ['17:00'] },
          tuesday: { enabled: true, times: ['17:00'] },
          wednesday: { enabled: true, times: ['17:00'] },
          thursday: { enabled: true, times: ['17:00'] },
          friday: { enabled: true, times: ['17:00'] },
          saturday: { enabled: false, times: [] },
          sunday: { enabled: false, times: [] },
        },
        sameTimeWeekdays: true,
      },
    });

    // Answer Calls - Comprehensive
    updateSection('answerCalls', {
      businessType: 'Medical / Healthcare (hospitals, clinics)',
      routine: {
        useStandard: false,
        custom: 'Take a detailed message and email to office',
        guidelines: 'Be courteous and professional at all times'
      },
      urgent: {
        useStandard: false,
        custom: 'Immediately contact on-call physician',
        guidelines: 'Assess severity and dispatch accordingly'
      },
      categories: [
        {
          id: generateId(),
          selectedCommon: 'Patient calling for provider / doctor',
          customName: 'Patient Calling Doctor',
          details: 'What clarifying questions should agents ask?\n• Patient name and date of birth\n• Reason for call - is this urgent or routine?\n• Best callback number\n• Preferred callback time\n\nHow do we identify this from other calls?\n• Caller identifies as a patient\n• Requesting to speak with or get a message to their doctor\n\nWhat follow-up questions confirm the issue?\n• Is this regarding new symptoms or existing condition?\n• Have you been seen at our office before?\n\nAny safety or access notes?\n• Verify patient identity before discussing medical information'
        },
        {
          id: generateId(),
          selectedCommon: 'Prescription / RX / pharmacy / medication refill',
          customName: 'Prescription Refills',
          details: 'What clarifying questions should agents ask?\n• Patient name and date of birth\n• Medication name and dosage\n• Pharmacy name and phone number\n• When was the last refill?\n\nHow do we identify this from other calls?\n• Caller specifically mentions prescription, refill, or pharmacy\n• May be calling from pharmacy directly\n\nWhat follow-up questions confirm the issue?\n• Is this a routine refill or new medication?\n• How many refills are needed?\n\nAny safety or access notes?\n• Process same business day if received before 2pm'
        },
        {
          id: generateId(),
          selectedCommon: 'Page on-call doctor / nurse / provider / consult',
          customName: 'Emergency - Page On-Call',
          details: 'What clarifying questions should agents ask?\n• Patient name and date of birth\n• Nature of emergency - symptoms\n• Current location\n• Best contact number\n• Is patient in immediate danger?\n\nHow do we identify this from other calls?\n• Caller indicates urgent medical situation\n• Symptoms that cannot wait until office hours\n• Using words like "emergency," "urgent," "can\'t breathe," etc.\n\nWhat follow-up questions confirm the issue?\n• When did symptoms start?\n• Has patient taken any medication?\n• Should we call 911?\n\nAny safety or access notes?\n• Page on-call physician immediately\n• Get callback number and stay on line if needed'
        },
        {
          id: generateId(),
          selectedCommon: 'Labs / test / diagnostic / critical results',
          customName: 'Lab Results',
          details: 'What clarifying questions should agents ask?\n• Patient name and date of birth\n• Type of test/lab work\n• When was test performed?\n• Who ordered the test?\n\nHow do we identify this from other calls?\n• Caller specifically mentions test results, lab work, or diagnostic results\n• May be lab calling with critical results\n\nWhat follow-up questions confirm the issue?\n• Is this routine results or critical/urgent?\n• Does patient need to speak with doctor or just get results?\n\nAny safety or access notes?\n• Critical results must be escalated immediately to on-call physician'
        },
        {
          id: generateId(),
          selectedCommon: 'Insurance / billing / authorization / referral info',
          customName: 'Billing & Insurance',
          details: 'What clarifying questions should agents ask?\n• Patient name and date of birth\n• Account number if available\n• Nature of billing question\n• Insurance company name\n\nHow do we identify this from other calls?\n• Caller mentions billing, insurance, payment, or statement\n• Asking about coverage or authorization\n\nWhat follow-up questions confirm the issue?\n• Is this about a specific visit or ongoing care?\n• Have you received a bill or statement?\n\nAny safety or access notes?\n• Route to billing department during business hours\n• Take detailed message for after-hours'
        },
        {
          id: generateId(),
          selectedCommon: 'Other / office message / not sure – take a message',
          customName: 'General Messages',
          details: 'What clarifying questions should agents ask?\n• Caller name and relationship to practice\n• Best callback number\n• Brief message or reason for call\n• Is this time-sensitive?\n\nHow do we identify this from other calls?\n• Doesn\'t fit other categories\n• General questions or information requests\n\nWhat follow-up questions confirm the issue?\n• Does this need same-day response?\n• Who should receive this message?\n\nAny safety or access notes?\n• Email to office staff for next business day'
        },
      ],
      callTypes: {
        newLead: {
          enabled: true,
          customLabel: 'New Patient',
          instructions: 'Collect name, contact info, and reason for visit',
          reachPrimary: 'Dr. Sarah Johnson',
          reachSecondary: 'Office Manager',
          notes: 'Schedule callback within 24 hours',
          autoEmailOffice: true
        },
        existingClient: {
          enabled: true,
          customLabel: 'Existing Patient',
          instructions: 'Verify patient info and take message',
          reachPrimary: 'Assigned Doctor',
          reachSecondary: 'Head Nurse',
          notes: 'Check if urgent or routine',
          autoEmailOffice: true
        },
        urgentIssue: {
          enabled: true,
          customLabel: 'Medical Emergency',
          instructions: 'Immediately page on-call physician',
          reachPrimary: 'On-Call Doctor',
          reachSecondary: 'Backup Doctor',
          notes: 'Get callback number and brief description',
          autoEmailOffice: true
        },
        serviceRequest: {
          enabled: true,
          customLabel: 'Prescription Refill',
          instructions: 'Collect patient info, medication, and pharmacy',
          reachPrimary: 'Nursing Staff',
          reachSecondary: 'Office Manager',
          notes: 'Process within same business day',
          autoEmailOffice: true
        },
        billingQuestion: {
          enabled: true,
          customLabel: 'Billing/Insurance',
          instructions: 'Transfer to billing or take detailed message',
          reachPrimary: 'Billing Department',
          reachSecondary: 'Office Manager',
          notes: 'Include account number if available',
          autoEmailOffice: true
        },
        otherText: 'General inquiries, appointment scheduling',
      },
    });

    // On Call - Comprehensive with schedule
    updateSection('onCall', {
      teamSize: 4,
      collectEmailsForRecaps: true,
      rotation: {
        doesNotChange: false,
        otherExplain: '',
        whenChanges: 'Weekly rotation every Monday',
        frequency: 'weekly',
        changeBeginsTime: '08:00',
        dayOrDate: 'Monday',
      },
      contactRules: {
        allCalls: false,
        callerCannotWait: true,
        holdAllCalls: false,
        emergencyOnly: false,
        specificCallTypes: true,
        notes: 'Contact for medical emergencies and urgent patient matters',
        emergencyDefinition: 'Life-threatening situations, severe pain, or critical symptoms',
        specificTypes: 'Medical emergencies, urgent patient calls, critical lab results',
      },
      procedures: {
        onCallProcedures: 'Text first, then call if no response within 10 minutes',
        businessHoursNotification: 'Email all non-urgent messages to office@abcmedical.com',
        businessHoursSameAsOnCall: false,
        attempts: '3',
        minutesBetweenAttempts: '5',
        escalateAfterMinutes: '15',
        escalateTo: 'Next person in rotation',
        stopAfterSuccessfulContact: true,
        leaveVoicemail: true,
        smsOk: true,
        emailOk: false,
      },
      scheduleType: 'fixed',
      fixedOrder: [
        {
          id: generateId(),
          memberId: '',
          name: 'Dr. Sarah Johnson',
          role: 'Primary Physician',
        },
        {
          id: generateId(),
          memberId: '',
          name: 'Dr. Michael Chen',
          role: 'Backup Physician',
        },
        {
          id: generateId(),
          memberId: '',
          name: 'Nurse Emily Rodriguez',
          role: 'Head Nurse',
        },
      ],
      team: [
        {
          id: generateId(),
          name: 'Dr. Sarah Johnson',
          title: 'Primary Physician',
          role: 'primary',
          email: ['sarah.johnson@abcmedical.com'],
          cellPhone: ['206-555-2001'],
          homePhone: [''],
          textCell: ['206-555-2001'],
          pager: [''],
          escalationSteps: [
            {
              id: generateId(),
              contactMethod: 'text',
              attempts: '1',
              interval: '5',
            },
            {
              id: generateId(),
              contactMethod: 'call',
              attempts: '3',
              interval: '5',
            },
          ],
        },
        {
          id: generateId(),
          name: 'Dr. Michael Chen',
          title: 'Backup Physician',
          role: 'backup',
          email: ['michael.chen@abcmedical.com'],
          cellPhone: ['206-555-2002'],
          homePhone: [''],
          textCell: ['206-555-2002'],
          pager: [''],
          escalationSteps: [
            {
              id: generateId(),
              contactMethod: 'call',
              attempts: '3',
              interval: '5',
            },
          ],
        },
        {
          id: generateId(),
          name: 'Nurse Emily Rodriguez',
          title: 'Head Nurse',
          role: 'primary',
          email: ['emily.rodriguez@abcmedical.com'],
          cellPhone: ['206-555-2003'],
          homePhone: [''],
          textCell: ['206-555-2003'],
          pager: [''],
          escalationSteps: [
            {
              id: generateId(),
              contactMethod: 'call',
              attempts: '2',
              interval: '10',
            },
            {
              id: generateId(),
              contactMethod: 'email',
              attempts: '1',
              interval: '15',
            },
          ],
        },
        {
          id: generateId(),
          name: 'Office Manager - Lisa Park',
          title: 'Office Manager',
          role: 'backup',
          email: ['lisa.park@abcmedical.com'],
          cellPhone: ['206-555-2004'],
          homePhone: ['206-555-2005'],
          textCell: ['206-555-2004'],
          pager: [''],
          escalationSteps: [
            {
              id: generateId(),
              contactMethod: 'call',
              attempts: '2',
              interval: '5',
            },
            {
              id: generateId(),
              contactMethod: 'text',
              attempts: '1',
              interval: '5',
            },
          ],
        },
      ],
      departments: [
        {
          id: generateId(),
          name: 'Emergency Medicine',
          description: 'Critical patient care',
        },
        {
          id: generateId(),
          name: 'General Practice',
          description: 'Routine patient care',
        },
      ],
      escalation: [],
    });

    // Call Routing - All 6 categories with detailed assignments
    // Note: categoryId must match the id from answerCalls.categories
    const routingCategories = [
      {
        categoryName: 'Patient Calling Doctor',
        whenToContact: 'business-hours',
        specialInstructions: 'Route to office during business hours, on-call after hours',
        steps: [
          { contactPerson: 'Lisa Park', contactMethod: 'email', notes: 'Email to office staff during business hours', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: true },
        ],
      },
      {
        categoryName: 'Prescription Refills',
        whenToContact: 'business-hours',
        specialInstructions: 'Process same day if received before 2pm',
        steps: [
          { contactPerson: 'Nurse Emily Rodriguez', contactMethod: 'email', notes: 'Send prescription refill request to nursing staff', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: true },
        ],
      },
      {
        categoryName: 'Emergency - Page On-Call',
        whenToContact: 'all-hours',
        specialInstructions: 'Immediate response required - page on-call physician',
        steps: [
          { contactPerson: 'Dr. Sarah Johnson', contactMethod: 'text', notes: 'Text on-call physician with emergency details', ifNaAction: 'go-to-next', repeatSteps: false, holdForCheckIn: false },
          { contactPerson: 'Dr. Sarah Johnson', contactMethod: 'call', notes: 'Call if no text response within 5 minutes', ifNaAction: 'go-to-next', repeatSteps: true, holdForCheckIn: false },
          { contactPerson: 'Dr. Michael Chen', contactMethod: 'call', notes: 'Escalate to backup physician', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: false },
        ],
      },
      {
        categoryName: 'Lab Results',
        whenToContact: 'all-hours',
        specialInstructions: 'Critical results must be escalated immediately',
        steps: [
          { contactPerson: 'Dr. Sarah Johnson', contactMethod: 'call', notes: 'Call on-call physician with critical lab results', ifNaAction: 'go-to-next', repeatSteps: true, holdForCheckIn: false },
          { contactPerson: 'Dr. Michael Chen', contactMethod: 'call', notes: 'Escalate to backup if primary unavailable', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: false },
        ],
      },
      {
        categoryName: 'Billing & Insurance',
        whenToContact: 'business-hours',
        specialInstructions: 'Route to billing department',
        steps: [
          { contactPerson: 'Lisa Park', contactMethod: 'email', notes: 'Email billing inquiries to office manager', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: true },
        ],
      },
      {
        categoryName: 'General Messages',
        whenToContact: 'business-hours',
        specialInstructions: 'Hold for next business day unless urgent',
        steps: [
          { contactPerson: 'Lisa Park', contactMethod: 'email', notes: 'Email general messages to office staff', ifNaAction: 'hold', repeatSteps: false, holdForCheckIn: true },
        ],
      },
    ];

    updateSection('callRouting', {
      categoryAssignments: routingCategories.map((cat, index) => ({
        id: generateId(),
        categoryId: `cat-${index}`,
        categoryName: cat.categoryName,
        whenToContact: cat.whenToContact,
        specialInstructions: cat.specialInstructions,
        finalAction: 'repeat-until-delivered',
        afterHoursFinalAction: 'repeat-until-delivered',
        escalationSteps: cat.steps.map(step => ({
          id: generateId(),
          contactPerson: step.contactPerson,
          contactMethod: step.contactMethod,
          notes: step.notes,
          ifNaAction: step.ifNaAction,
          repeatSteps: step.repeatSteps,
          holdForCheckIn: step.holdForCheckIn,
        })),
      })),
    });

    // Metrics
    updateSection('metrics', {
      callVolume: {
        avgDaily: '25-30',
        peakWindow: '9:00 AM - 11:00 AM',
        overnightPct: '15%',
        notes: 'Higher volume on Mondays',
      },
    });

    // Final Details
    updateSection('finalDetails', {
      additionalNotes: 'Please ensure all urgent calls are handled with priority. Our patients expect prompt responses.',
      documentsUploaded: [],
      agreeToTerms: true,
      signatureName: 'Dr. Sarah Johnson',
      signatureDate: new Date().toISOString().split('T')[0],
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingMode(null);
    history.push(WIZARD_ROUTES.COMPANY_INFO);
  };

  const setupSteps = [
    { icon: <BusinessOutlined />, title: 'Company Information', desc: 'Essential contacts and addresses' },
    { icon: <PhoneOutlined />, title: 'Answer Calls', desc: 'How our agents will answer incoming calls' },
    { icon: <ScheduleOutlined />, title: 'On Call Setup', desc: 'On-call team members and schedules' },
    { icon: <GroupOutlined />, title: 'Team Setup', desc: 'Group on-call personnel into teams or departments' },
    { icon: <AccountTreeOutlined />, title: 'Escalation & Rotation Details', desc: 'Define escalation contacts, schedules, and coverage timing' },
    { icon: <RouteOutlined />, title: 'Call Routing', desc: 'Assign team members to call categories' },
    { icon: <EventOutlined />, title: 'Final Details', desc: 'Choose availability and upload documents' },
    { icon: <ReviewsOutlined />, title: 'Review & Submit', desc: 'Confirm everything before we start' },
  ];

  const benefits = [
    'Professional call answering 24/7',
    'Customized greeting and procedures',
    'Seamless integration with your business',
    'Detailed call reporting and analytics',
  ];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Hero Section */}
        <Fade in timeout={800}>
            <Paper 
            elevation={3} 
            sx={{ 
              ...sharedStyles.layout.wizardCard,
              textAlign: 'center',
              p: { xs: 2, md: 3 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box sx={{ mb: 3 }} role="region" aria-labelledby="startnewclient-title">
              <img
                src={AnSerLogoStar}
                alt="AnSer Communications"
                loading="lazy"
                decoding="async"
                style={{ 
                  height: isMobile ? 80 : 120, 
                  marginBottom: 20,
                  filter: darkMode ? 'brightness(0.9)' : 'none'
                }}
              />
            </Box>

            <Typography 
              id="startnewclient-title"
              component="h1"
              variant={isMobile ? 'h5' : 'h4'} 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1
              }}
            >
              Welcome to AnSer
            </Typography>
            
            <Typography 
              variant="body2"
              color="text.secondary" 
              sx={{ 
                mb: 2,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Let's set up your professional call-handling service in a few easy steps
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Chip 
                icon={<TimerOutlined />} 
                label="~15 minutes" 
                color="primary" 
                variant="outlined"
                size="small"
              />
              <Chip 
                icon={<CheckCircleOutlined />} 
                label={`${setupSteps.length} simple steps`} 
                color="secondary" 
                variant="outlined"
                size="small"
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleStart}
                disabled={isLoading}
                startIcon={loadingMode === 'standard' ? <CircularProgress size={20} /> : <PlayArrowRounded />}
                sx={{ 
                  ...sharedStyles.navigation.nextButton,
                  minWidth: isMobile ? 240 : 260,
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '1rem' : '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  }
                }}
                aria-label={loadingMode === 'standard' ? 'Starting Your Setup' : 'Start Client Setup'}
                aria-busy={isLoading}
                aria-live="polite"
              >
                {loadingMode === 'standard' ? 'Starting Your Setup…' : 'Start Client Setup'}
              </Button>

            </Box>

          </Paper>
        </Fade>

        {/* Setup Steps Preview */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'center', 
                mb: 3, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              What We'll Set Up Together
            </Typography>
            
            <Grid container spacing={3}>
              {setupSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box 
                        sx={{ 
                          color: theme.palette.primary.main, 
                          mb: 2,
                          '& svg': { fontSize: 40 }
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Fill Test Data Button */}
        <Fade in timeout={1400}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleFillTestData}
              disabled={isLoading}
              startIcon={loadingMode === 'test' ? <CircularProgress size={16} /> : <BugReportIcon />}
              sx={{
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {loadingMode === 'test' ? 'Loading Test Data…' : 'Fill Test Data'}
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.disabled' }}>
              Pre-fill the form with sample data for testing
            </Typography>
          </Box>
        </Fade>

        {/* Benefits Section */}
        <Fade in timeout={1600}>
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Why Choose AnSer?
            </Typography>
            
            <List sx={{ maxWidth: 500, mx: 'auto' }}>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleOutlined sx={{ color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit}
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontSize: '1rem',
                        fontWeight: 500 
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </Container>

      {/* Draft Recovery Dialog */}
      <Dialog
        open={showRestoreDialog}
        onClose={() => setShowRestoreDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          📄 Resume Previous Session?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            We found a saved draft from a previous session. Would you like to continue where you left off?
          </DialogContentText>
          <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary">
              Your progress is automatically saved as you work. You can safely leave and return anytime.
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleStartFresh} variant="outlined" color="inherit">
            Start Fresh
          </Button>
          <Button onClick={handleRestoreDraft} variant="contained" autoFocus>
            Resume Draft
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default StartNewClient;
