// 📁 src/pages/ClientInfo/shared_layout_routing/ClientInfoReactRoutes.js

import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import { WizardProvider } from '../context_API/WizardContext';
import { ClientInfoThemeProvider } from '../context_API/ClientInfoThemeContext';
import WizardLayout from './WizardLayout';

const StartNewClient = lazy(() => import('../pages/StartNewClient'));
const ClientSetUp = lazy(() => import('../pages/ClientSetUp'));
const AnswerCalls = lazy(() => import('../pages/AnswerCallsNew'));
const FinalDetails = lazy(() => import('../pages/FinalDetails'));
const ReviewStep = lazy(() => import('../pages/ReviewStep'));
const OnCall = lazy(() => import('../pages/OnCall'));
const CallRouting = lazy(() => import('../pages/CallRouting'));
const OfficeReach = lazy(() => import('../pages/OfficeReach'));
const InviteLinkHandler = lazy(() => import('../pages/InviteLinkHandler'));
const AdminInvite = lazy(() => import('../pages/AdminInvite'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ClientInfoReactRoutesInner = () => (
  <>
    <ScrollToTop />
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <Switch>
        <Route exact path="/ClientInfoReact" component={StartNewClient} />
        <Route exact path="/ClientInfoReact/admin-invite">
          <WizardLayout>
            <AdminInvite />
          </WizardLayout>
        </Route>
        <Route exact path="/ClientInfoReact/invite/:token">
          <WizardLayout>
            <InviteLinkHandler />
          </WizardLayout>
        </Route>
        <Route exact path="/ClientInfoReact/NewFormWizard" render={() => <Redirect to="/ClientInfoReact/NewFormWizard/company-info" />} />

        {/* Wizard routes wrapped in shared WizardLayout so navbar/footer render once */}
        <Route path="/ClientInfoReact/NewFormWizard">
          <WizardLayout>
            <Switch>
              {/* Wizard routes in desired order */}
              <Route path="/ClientInfoReact/NewFormWizard/company-info" component={ClientSetUp} />
              <Route path="/ClientInfoReact/NewFormWizard/answer-calls" component={AnswerCalls} />
              <Route exact path="/ClientInfoReact/NewFormWizard/on-call" component={OnCall} />
              <Route exact path="/ClientInfoReact/NewFormWizard/on-call/teams" render={() => <Redirect to="/ClientInfoReact/NewFormWizard/team-setup" />} />
              <Route exact path="/ClientInfoReact/NewFormWizard/on-call/escalation" render={() => <Redirect to="/ClientInfoReact/NewFormWizard/escalation-details" />} />
              <Route path="/ClientInfoReact/NewFormWizard/team-setup" component={OnCall} />
              <Route path="/ClientInfoReact/NewFormWizard/escalation-details" component={OnCall} />
              <Route path="/ClientInfoReact/NewFormWizard/on-call-rotation" render={() => <Redirect to="/ClientInfoReact/NewFormWizard/escalation-details" />} />
              <Route path="/ClientInfoReact/NewFormWizard/call-routing" component={CallRouting} />
              <Route path="/ClientInfoReact/NewFormWizard/office-reach" component={OfficeReach} />
              <Route path="/ClientInfoReact/NewFormWizard/final-details" component={FinalDetails} />
              <Route path="/ClientInfoReact/NewFormWizard/review" component={ReviewStep} />

              {/* Fast Track route */}
              <Route path="/ClientInfoReact/NewFormWizard/fast-track" component={lazy(() => import('../pages/FastTrack'))} />

              <Route component={StartNewClient} />
            </Switch>
          </WizardLayout>
        </Route>

      </Switch>
    </Suspense>
  </>
);

const ClientInfoReactRoutes = () => (
  <WizardProvider>
    <ClientInfoThemeProvider>
      <ErrorBoundary>
        <ClientInfoReactRoutesInner />
      </ErrorBoundary>
    </ClientInfoThemeProvider>
  </WizardProvider>
);

export default ClientInfoReactRoutes;
