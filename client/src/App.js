import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Index from './pages/Index';
import Vessels from './pages/Vessels';
import AgentStats from './pages/AgentStats';
import ContactDispatch from './pages/ContactDispatch';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <>
        <div className='text-light bg-dark' style={{minHeight: '100vh'}}>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Index} />
            <Route exact path='/Vessels' component={Vessels} />
            <Route exact path='/ContactDispatch' component={ContactDispatch} />
            <Route exact path='/AgentStats' component={AgentStats} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </div>
      </>
    </Router>
  );
}

export default App;
