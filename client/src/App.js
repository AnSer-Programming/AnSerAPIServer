import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

// Page Navigation Components
import AgentStats from './pages/AgentStats';
import BackUps from './pages/BackUps';
import Calendar from './pages/Calendar';
import ContactDispatch from './pages/ContactDispatch';
import CrescentElectricReachList from './pages/CrescentElectricReachList';
import DisconnectList from './pages/DisconnectList';
import FixedScheduler from './pages/StaticSchedule';
import HowTo from './pages/HowTo';
import OCGroupList from './pages/OCGroupList';
import Index from './pages/Index';
import Info from './pages/Info';
import ResidentDirectory from './pages/ResidentDirectory';
import SchedulerSupervisor from './pages/SchedulerSupervisor';
import SchedulerAgent from './pages/SchedulerAgent';
import Tracker from './pages/TrackerPages';
import VesselsList from './pages/VesselList';

// Features
import ReportIssue from './pages/ReportIssue';
import ClientInfo from './pages/ClientInfo'; // Import ClientInfo component

function App() {
  // const signedInContext = createContext(false);
  // State for handling modal visibility
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {}, [signedIn]);

  const loginHandler = () => {
    setSignedIn(true);
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

  const loginRequired = () => {
    return (
      <>
        <Switch>
          <Route exact path='/' component={Index} />
          <Route exact path='/AgentStats' component={Index} />
          <Route exact path='/BackUps' component={Index} />
          <Route exact path='/Calendar' component={Index} />
          {/* <Route exact path='/ContactDispatch' component={ContactDispatch} /> */}
          <Route exact path='/CrescentElectricReachList' component={Index} />
          <Route exact path='/DisconnectList' component={Index} />
          <Route exact path='/HowTo' component={Index} />
          <Route exact path='/HowTo/*' component={Index} />
          <Route exact path='/Info' component={Index} />
          <Route exact path='/Info/*' component={Index} />
          <Route exact path='/OCGroupList' component={Index} />
          <Route exact path='/ResidentDirectory' component={Index} />
          <Route exact path='/Scheduler' component={Index} />
          <Route exact path='/SchedulerSupervisor' component={Index} />
          <Route exact path='/StaticSchedule' component={Index} />
          <Route exact path='/StatTracker' component={Index} />
          <Route exact path='/Vessels' component={Index} />
          <Route exact path='/ClientInfo' component={Index} /> {/* Add ClientInfo route */}
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    )
  }

  const loggedIn = () => {
    return (
      <>
        <Switch>
          <Route exact path='/' component={Index} />
          <Route exact path='/AgentStats' component={AgentStats} />
          <Route exact path='/BackUps' component={BackUps} />
          <Route exact path='/Calendar' component={Calendar} />
          {/* <Route exact path='/ContactDispatch' component={ContactDispatch} /> */}
          <Route exact path='/CrescentElectricReachList' component={CrescentElectricReachList} />
          <Route exact path='/DisconnectList' component={DisconnectList} />
          <Route exact path='/HowTo' component={HowTo} />
          <Route exact path='/HowTo/*' component={HowTo} />
          <Route exact path='/Info' component={Info} />
          <Route exact path='/Info/*' component={Info} />
          <Route exact path='/OCGroupList' component={OCGroupList} />
          <Route exact path='/ResidentDirectory' component={ResidentDirectory} />
          <Route exact path='/Scheduler' component={SchedulerAgent} />
          <Route exact path='/SchedulerSupervisor' component={SchedulerSupervisor} />
          <Route exact path='/StaticSchedule' component={FixedScheduler} />
          <Route exact path='/StatTracker' component={Tracker} />
          <Route exact path='/Vessels' component={VesselsList} />
          <Route exact path='/ClientInfo' component={ClientInfo} /> {/* Add ClientInfo route */}
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    )
  }

  return (
    <Router>
      <div className='text-light bg-dark' style={{ minHeight: '100vh' }}>
        {signedIn ? loggedIn() : loginRequired()}
        {
          signedIn ? <></> :
            <>
              <div>
                <p>In order to access the full site you will need to sign in first!</p>
              </div>
              <button onClick={loginHandler}>LogIn</button>
            </>
        }
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