import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Index from './pages/Index';
import Vessels from './pages/Vessels';
import DisconnectList from './pages/DisconnectList';
import AgentStats from './pages/AgentStats';
import ContactDispatch from './pages/ContactDispatch';
import Calendar from './pages/Calendar';
import Tracker from './pages/TrackerPages';
import Info from './pages/Info';
import ResidentDirectory from './pages/ResidentDirectory';

function App() {
  return (
    <Router>
      <>
        <div className='text-light bg-dark' style={{minHeight: '100vh'}}>
          <Switch>
            <Route exact path='/' component={Index} />
            <Route exact path='/Vessels' component={Vessels} />
            <Route exact path='/DisconnectList' component={DisconnectList} />
            <Route exact path='/ContactDispatch' component={ContactDispatch} />
            <Route exact path='/Calendar' component={Calendar} />
            <Route exact path='/AgentStats' component={AgentStats} />
            <Route exact path='/StatTracker' component={Tracker} />
            <Route exact path='/Info' component={Info} />
            <Route exact path='/ResidentDirectory' component={ResidentDirectory} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </div>
      </>
    </Router>
  );
}

export default App;
