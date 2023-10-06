import React from 'react';
import Menu from '../components/Menu.tsx';
import ActiveAgents from '../components/TrackerComponents/GetActiveAgents.tsx';
import CompletedCalls from '../components/TrackerComponents/GetCompletedCalls.tsx';

const StatTracker = () => {
  return (
    <>
      <Menu 
        page="Stat Tracker" />
      <p>Data updates every minute</p>
      <ActiveAgents />
      <CompletedCalls />
    </>
  );
};

export default StatTracker;