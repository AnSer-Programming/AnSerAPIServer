import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import Menu from './components/Menu.tsx';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import AgentStats from './pages/AgentStats';
import BackUps from './pages/BackUps';
// import Calendar from './pages/Calendar';
// import ContactDispatch from './pages/ContactDispatch';
import CrescentElectricReachList from './pages/CrescentElectricReachList';
import DisconnectList from './pages/DisconnectList';
import FixedScheduler from './pages/StaticSchedule';
import HolidaySchedule from './pages/HolidaySignUpAgentPage';
import HolidayScheduleSignUp from './pages/HolidaySignUp';
import HowTo from './pages/HowTo';
import OCGroupList from './pages/OCGroupList';
import Index from './pages/Index';
import Info from './pages/Info';
import ResidentDirectory from './pages/ResidentDirectory';
import SchedulerSupervisor from './pages/SchedulerSupervisor';
import SchedulerAgent from './pages/SchedulerAgent';
import Tracker from './pages/TrackerPages';
import VesselsList from './pages/VesselList';

import ReportIssue from './pages/ReportIssue';
import ClientInfo from './pages/ClientInfo'; // Legacy Client Info

import ClientInfoReactRoutes from './pages/ClientInfo/ClientInfoReactRoutes';

const AppContent = () => {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const location = useLocation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loginHandler = () => setSignedIn(true);

  const loginButton = () => (
    <>
      <Menu page="Home" />
      {!signedIn && (
        <>
          <div>
            <p>In order to access the full site you will need to sign in first!</p>
          </div>
          <button onClick={loginHandler}>LogIn</button>
        </>
      )}
    </>
  );

  const style = {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000000',
    boxShadow: 24,
    p: 4,
    zIndex: '100',
  };

  const isClientInfoReact = location.pathname.startsWith('/ClientInfoReact');

  return (
    <div className="text-light bg-dark" style={{ height: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/AgentStats" component={AgentStats} />
        <Route exact path="/BackUps" component={signedIn ? BackUps : loginButton} />
        {/* <Route exact path="/Calendar" component={signedIn ? Calendar : loginButton} /> */}
        <Route exact path="/CrescentElectricReachList" component={signedIn ? CrescentElectricReachList : loginButton} />
        <Route exact path="/DisconnectList" component={signedIn ? DisconnectList : loginButton} />
        <Route exact path="/HolidaySchedule" component={HolidaySchedule} />
        <Route exact path="/HolidayScheduleSignUp" component={signedIn ? HolidayScheduleSignUp : loginButton} />
        <Route exact path="/HowTo" component={HowTo} />
        <Route exact path="/HowTo/*" component={HowTo} />
        <Route exact path="/Info" component={Info} />
        <Route exact path="/Info/*" component={Info} />
        <Route exact path="/OCGroupList" component={signedIn ? OCGroupList : loginButton} />
        <Route exact path="/ResidentDirectory" component={signedIn ? ResidentDirectory : loginButton} />
        <Route exact path="/Scheduler" component={signedIn ? SchedulerAgent : loginButton} />
        <Route exact path="/SchedulerSupervisor" component={signedIn ? SchedulerSupervisor : loginButton} />
        <Route exact path="/StaticSchedule" component={signedIn ? FixedScheduler : loginButton} />
        <Route exact path="/StatTracker" component={Tracker} />
        <Route exact path="/Vessels" component={signedIn ? VesselsList : loginButton} />
        <Route exact path="/ClientInfo" component={signedIn ? ClientInfo : loginButton} />

        {/* React Client Info Themed Routes */}
        <Route path="/ClientInfoReact" component={ClientInfoReactRoutes} />

        {/* Catch-all */}
        <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
      </Switch>

      {/* Floating Report Issue Modal (only if NOT in ClientInfoReact) */}
      {!isClientInfoReact && (
        <>
          <Button
            onClick={handleOpen}
            style={{ position: 'absolute', bottom: '10px', right: '25px', zIndex: '99' }}
            color="secondary"
            variant="contained"
          >
            Report Issue
          </Button>
          <Modal keepMounted open={open} onClose={handleClose}>
            <Box sx={style}>
              <ReportIssue />
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
