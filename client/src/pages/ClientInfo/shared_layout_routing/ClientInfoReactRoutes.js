// 📁 src/pages/ClientInfo/shared_layout_routing/ClientInfoReactRoutes.js

import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import { WizardProvider } from '../context_API/WizardContext';
import { ClientInfoThemeProvider } from '../context_API/ClientInfoThemeContext';

const StartNewClient = lazy(() => import('../pages/StartNewClient'));
const ClientSetUp = lazy(() => import('../pages/ClientSetUp'));
const OfficeReach = lazy(() => import('../pages/OfficeReach'));
const AnswerCalls = lazy(() => import('../pages/AnswerCalls'));
const FinalDetails = lazy(() => import('../pages/FinalDetails'));
const ReviewStep = lazy(() => import('../pages/ReviewStep'));
const OnCall = lazy(() => import('../pages/OnCall'));
const InviteLinkHandler = lazy(() => import('../pages/InviteLinkHandler'));
const AdminInvite = lazy(() => import('../pages/AdminInvite'));
const FastTrack = lazy(() => import('../pages/FastTrack'));

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
        <Route exact path="/ClientInfoReact/NewFormWizard" render={() => <Redirect to="/ClientInfoReact/NewFormWizard/company-info" />} />
        <Route path="/ClientInfoReact/NewFormWizard/company-info" component={ClientSetUp} />
        <Route path="/ClientInfoReact/NewFormWizard/office-reach" component={OfficeReach} />
  <Route path="/ClientInfoReact/NewFormWizard/answer-calls" component={AnswerCalls} />
  <Route path="/ClientInfoReact/admin-invite" component={AdminInvite} />
  <Route path="/ClientInfoReact/invite/:token" component={InviteLinkHandler} />
        <Route path="/ClientInfoReact/NewFormWizard/final-details" component={FinalDetails} />
        <Route path="/ClientInfoReact/NewFormWizard/on-call" component={OnCall} />
        <Route path="/ClientInfoReact/NewFormWizard/review" component={ReviewStep} />
  <Route path="/ClientInfoReact/fast-track" component={FastTrack} />
        <Route component={StartNewClient} />
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
