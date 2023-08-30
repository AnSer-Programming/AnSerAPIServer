import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Index from './pages/Index';
import Vessels from './pages/Vessels';
import AgentStats from './pages/AgentStats';
import ContactDispatch from './pages/ContactDispatch';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <>
        <Switch>
          <Route exact path='/' component={Index} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
        <Navbar />
      </>
    </Router>
  );
}

export default App;
