// src/pages/ClientInfo/NewFormWizard.jsx
import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import ClientSetUp from './ClientSetUp';
import OfficeReach from './OfficeReach';
import AnswerCalls from './AnswerCalls';
import ReviewStep from './ReviewStep';

import './ClientInfoReact.css';

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
      <Route exact path={`${path}/Review`} component={ReviewStep} />
      <Route>
        <h2 className="text-danger text-center mt-5">Step not found</h2>
      </Route>
    </Switch>
  );
};

export default NewFormWizard;
