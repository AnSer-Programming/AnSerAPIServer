import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AgentStats from './pages/AgentStats';
import Calendar from './pages/Calendar';
import ContactDispatch from './pages/ContactDispatch';
import CrescentElectricReachList from './pages/CrescentElectricReachList';
import DisconnectList from './pages/DisconnectList';
import FixedScheduler from './pages/StaticSchedule';
import HowTo from './pages/HowTo';
import Index from './pages/Index';
import Info from './pages/Info';
import ResidentDirectory from './pages/ResidentDirectory';
import SchedulerSupervisor from './pages/SchedulerSupervisor';
import SchedulerAgent from './pages/SchedulerAgent';
import Tracker from './pages/TrackerPages';
import VesselsList from './pages/VesselList';

function App() {
  return (
    <Router>
      <>
        <div className='text-light bg-dark' style={{minHeight: '100vh'}}>
          <Switch>
            <Route exact path='/' component={Index} />
            <Route exact path='/AgentStats' component={AgentStats} />
            <Route exact path='/Calendar' component={Calendar} />
            <Route exact path='/ContactDispatch' component={ContactDispatch} />
            <Route exact path='/CrescentElectricReachList' component={CrescentElectricReachList} />
            <Route exact path='/DisconnectList' component={DisconnectList} />
            <Route exact path='/HowTo' component={HowTo} />
            <Route exact path='/HowTo/*' component={HowTo} />
            <Route exact path='/Info' component={Info} />
            <Route exact path='/Info/*' component={Info} />
            <Route exact path='/ResidentDirectory' component={ResidentDirectory} />
            <Route exact path='/Scheduler' component={SchedulerAgent} />
            <Route exact path='/SchedulerSupervisor' component={SchedulerSupervisor} />
            <Route exact path='/StaticSchedule' component={FixedScheduler} />
            <Route exact path='/StatTracker' component={Tracker} />
            <Route exact path='/Vessels' component={VesselsList} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </div>
      </>
    </Router>
  );
}

export default App;
