import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Index from './pages/Index';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Index} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
