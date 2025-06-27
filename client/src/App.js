import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Menu from './components/Menu.tsx';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import AgentStats from './pages/AgentStats';
import BackUps from './pages/BackUps';
import Calendar from './pages/Calendar';
import ContactDispatch from './pages/ContactDispatch';
import CrescentElectricReachList from './pages/CrescentElectricReachList';
import DisconnectList from './pages/DisconnectList';
import FixedScheduler from './pages/StaticSchedule';
import HolidaySchedule from './pages/HolidaySignUpAgentPageSummer';
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

// React Client Info Pages
import StartNewClient from './pages/ClientInfo/StartNewClient';
import ClientSetUp from './pages/ClientInfo/ClientSetUp';
import OfficeReach from './pages/ClientInfo/OfficeReach';
import AnswerCalls from './pages/ClientInfo/AnswerCalls';
import TestPage from './pages/ClientInfo/TestPage';
import NewFormWizard from './pages/ClientInfo/NewFormWizard';
import ATools from './pages/ClientInfo/ATools';
// import { ClientInfoThemeProvider } from './pages/ClientInfo/ClientInfoThemeContext';

function App() {
  // const signedInContext = createContext(false);
  // State for handling modal visibility
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => { }, [signedIn]);

  const loginHandler = () => {
    setSignedIn(true);
  }

  const loginButton = () => {
    return (
      <>
        <Menu
          page="Home" />
        {
          signedIn ? <></> :
            <>
              <div>
                <p>In order to access the full site you will need to sign in first!</p>
              </div>
              <button onClick={loginHandler}>LogIn</button>
            </>
        }
      </>
    )
  }

  // Modal styling
  const style = {
    position: 'absolute',
    bottom: '25px',
    right: '5px',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: '100',
  };

  return (
    <Router>
      <div className='text-light bg-dark' style={{ minHeight: '100vh' }}>
        <Switch>
          <Route exact path='/' component={Index} />
          <Route exact path='/AgentStats' component={signedIn ? AgentStats : loginButton} />
          <Route exact path='/BackUps' component={signedIn ? BackUps : loginButton} />
          <Route exact path='/Calendar' component={signedIn ? Calendar : loginButton} />
          {/* <Route exact path='/ContactDispatch' component={ContactDispatch} /> */}
          <Route exact path='/CrescentElectricReachList' component={signedIn ? CrescentElectricReachList : loginButton} />
          <Route exact path='/DisconnectList' component={signedIn ? DisconnectList : loginButton} />
          <Route exact path='/HolidaySchedule' component={HolidaySchedule} />
          <Route exact path='/HolidayScheduleSignUp' component={signedIn ? HolidayScheduleSignUp : loginButton} />
          <Route exact path='/HowTo' component={signedIn ? HowTo : loginButton} />
          <Route exact path='/HowTo/*' component={signedIn ? HowTo : loginButton} />
          <Route exact path='/Info' component={signedIn ? Info : loginButton} />
          <Route exact path='/Info/*' component={signedIn ? Info : loginButton} />
          <Route exact path='/OCGroupList' component={signedIn ? OCGroupList : loginButton} />
          <Route exact path='/ResidentDirectory' component={signedIn ? ResidentDirectory : loginButton} />
          <Route exact path='/Scheduler' component={signedIn ? SchedulerAgent : loginButton} />
          <Route exact path='/SchedulerSupervisor' component={signedIn ? SchedulerSupervisor : loginButton} />
          <Route exact path='/StaticSchedule' component={signedIn ? FixedScheduler : loginButton} />
          <Route exact path='/StatTracker' component={Tracker} />
          <Route exact path='/Vessels' component={signedIn ? VesselsList : loginButton} />
          <Route exact path='/ClientInfo' component={signedIn ? ClientInfo : loginButton} />
          <Route exact path='/ClientInfoReact' component={signedIn ? StartNewClient : loginButton} />
          <Route exact path='/ClientInfoReact/StartNewClient' component={signedIn ? StartNewClient : loginButton} />
          <Route exact path='/ClientInfoReact/ClientSetUp' component={signedIn ? ClientSetUp : loginButton} />
          <Route exact path='/ClientInfoReact/OfficeReach' component={signedIn ? OfficeReach : loginButton} />
          <Route exact path='/ClientInfoReact/AnswerCalls' component={signedIn ? AnswerCalls : loginButton} />
          <Route exact path='/ClientInfoReact/TestPage' component={signedIn ? TestPage : loginButton} />
          <Route exact path='/ClientInfoReact/NewFormWizard' component={signedIn ? NewFormWizard : loginButton} />
          <Route exact path='/ClientInfoReact/ATools' component={signedIn ? ATools : loginButton} />

          {/* React Client Info Routes */}
          {/* <Route path='/ClientInfoReact'>
            <ClientInfoThemeProvider>
              <Switch>
                <Route exact path='/ClientInfoReact' component={signedIn ? StartNewClient : loginButton} />
                <Route exact path='/ClientInfoReact/StartNewClient' component={signedIn ? StartNewClient : loginButton} />
                <Route exact path='/ClientInfoReact/ClientSetUp' component={signedIn ? ClientSetUp : loginButton} />
                <Route exact path='/ClientInfoReact/OfficeReach' component={signedIn ? OfficeReach : loginButton} />
                <Route exact path='/ClientInfoReact/AnswerCalls' component={signedIn ? AnswerCalls : loginButton} />
                <Route exact path='/ClientInfoReact/TestPage' component={signedIn ? TestPage : loginButton} />
                <Route exact path='/ClientInfoReact/NewFormWizard' component={signedIn ? NewFormWizard : loginButton} />
                <Route exact path='/ClientInfoReact/ATools' component={signedIn ? ATools : loginButton} />
              </Switch>
            </ClientInfoThemeProvider>
          </Route> */}

          {/* Catch-all */}
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
        {/* Report Issue Modal */}
        <div>
          <Button
            onClick={handleOpen}
            style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: '99' }}
            color='secondary'
            variant="contained"
          >
            Report Issue
          </Button>
          <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="report-issue-modal"
            aria-describedby="modal-window-to-allow-users-to-report-feedback"
          >
            <Box sx={style}>
              <ReportIssue />
            </Box>
          </Modal>
        </div>
      </div>
    </Router>
  );
}

export default App;