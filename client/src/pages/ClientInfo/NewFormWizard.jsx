// src/pages/ClientInfo/NewFormWizard.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import ClientSetUp from './ClientSetUp';
import OfficeReach from './OfficeReach';
import AnswerCalls from './AnswerCalls';
import FinalDetails from './FinalDetails';
import ReviewStep from './ReviewStep';

const NewFormWizard = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Redirect to={`${path}/ClientSetUp`} />
      </Route>
      <Route exact path={`${path}/ClientSetUp`} component={ClientSetUp} />
      <Route exact path={`${path}/OfficeReach`} component={OfficeReach} />
      <Route exact path={`${path}/AnswerCalls`} component={AnswerCalls} />
      <Route exact path={`${path}/FinalDetails`} component={FinalDetails} />
      <Route exact path={`${path}/Review`} component={ReviewStep} />
      <Route>
        <Typography variant="h4" color="error" align="center" sx={{ mt: 5 }}>
          Step not found
        </Typography>
      </Route>
    </Switch>
  );
};

export default NewFormWizard;
