import React from 'react';
import { Switch, Route } from 'react-router-dom';

import StartNewClient from './StartNewClient';
import NotFound from './NotFound';
import { ClientInfoThemeProvider } from './ClientInfoThemeContext';
import { WizardProvider } from './WizardContext';
import NewFormWizard from './NewFormWizard';

const ClientInfoReactRoutes = () => {
  return (
    <ClientInfoThemeProvider>
      <Switch>
        {/* Base path should also render StartNewClient */}
        <Route
          exact
          path="/ClientInfoReact"
          component={StartNewClient}
        />

        {/* Start Page explicitly */}
        <Route
          exact
          path="/ClientInfoReact/StartNewClient"
          component={StartNewClient}
        />

        {/* Intake Wizard */}
        <Route path="/ClientInfoReact/NewFormWizard">
          <WizardProvider>
            <NewFormWizard />
          </WizardProvider>
        </Route>

        {/* Catch-all 404 */}
        <Route component={NotFound} />
      </Switch>
    </ClientInfoThemeProvider>
  );
};

export default ClientInfoReactRoutes;
