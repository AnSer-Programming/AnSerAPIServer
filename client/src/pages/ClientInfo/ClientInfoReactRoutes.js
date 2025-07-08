import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import Auth from './Auth';
import ForgotPassword from './ForgotPassword';
import StartNewClient from './StartNewClient';
import SiteOverview from './SiteOverview';
import ATools from './ATools';
import AccountInformation from './AccountInformation';
import OnboardingComplete from './OnboardingComplete';
import NewFormWizard from './NewFormWizard';
import NotFound from './NotFound';

import WelcomePacket from './WelcomePacket';
import SignedDocuments from './SignedDocuments';
import UploadDocuments from './UploadDocuments';
import ServiceChanges from './ServiceChanges';
import CallLogs from './CallLogs';
import MonthlyReport from './MonthlyReport';
import SupportTicket from './SupportTicket';
import ContactManager from './ContactManager';
import ChangePassword from './ChangePassword';
import NotificationSettings from './NotificationSettings';
import ManageUsers from './ManageUsers';

import { ClientInfoThemeProvider } from './ClientInfoThemeContext';
import { WizardProvider } from './WizardContext';
import { AuthProvider, useAuth } from './AuthContext';

// Higher-order route that checks if the user is logged in
const ProtectedRoute = ({ children, ...rest }) => {
  const { loggedIn } = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/ClientInfoReact/Auth',
              state: { message: 'Please log in to access this page.' },
              from: location.pathname,
            }}
          />
        )
      }
    />
  );
};

const ClientInfoReactRoutes = () => {
  return (
    <ClientInfoThemeProvider>
      <AuthProvider>
        <Switch>
          {/* Public Routes */}
          <Route exact path="/ClientInfoReact" component={Auth} />
          <Route exact path="/ClientInfoReact/Auth" component={Auth} />
          <Route exact path="/ClientInfoReact/ForgotPassword" component={ForgotPassword} />

          {/* Core App Routes */}
          <ProtectedRoute exact path="/ClientInfoReact/StartNewClient">
            <StartNewClient />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/SiteOverview">
            <SiteOverview />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/AccountInformation">
            <AccountInformation />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/OnboardingComplete">
            <OnboardingComplete />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/ATools">
            <ATools />
          </ProtectedRoute>

          {/* Documents & Service */}
          <ProtectedRoute exact path="/ClientInfoReact/Documents/WelcomePacket">
            <WelcomePacket />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Documents/Signed">
            <SignedDocuments />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Documents/Upload">
            <UploadDocuments />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/ServiceChanges">
            <ServiceChanges />
          </ProtectedRoute>

          {/* Reports */}
          <ProtectedRoute exact path="/ClientInfoReact/Reports/CallLogs">
            <CallLogs />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Reports/Monthly">
            <MonthlyReport />
          </ProtectedRoute>

          {/* Support */}
          <ProtectedRoute exact path="/ClientInfoReact/Support/Ticket">
            <SupportTicket />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Support/ContactManager">
            <ContactManager />
          </ProtectedRoute>

          {/* Settings */}
          <ProtectedRoute exact path="/ClientInfoReact/Settings/Password">
            <ChangePassword />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Settings/Notifications">
            <NotificationSettings />
          </ProtectedRoute>

          <ProtectedRoute exact path="/ClientInfoReact/Settings/Users">
            <ManageUsers />
          </ProtectedRoute>

          {/* Onboarding Wizard */}
          <Route path="/ClientInfoReact/NewFormWizard">
            <WizardProvider>
              <NewFormWizard />
            </WizardProvider>
          </Route>

          {/* Catch-all 404 */}
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </ClientInfoThemeProvider>
  );
};

export default ClientInfoReactRoutes;
