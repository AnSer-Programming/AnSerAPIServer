// Active Agent API Call
export const getActiveAgents = () => {
  return fetch(`/api/ActiveAgentLog`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

  
export const getCallsCompleted = () => {
  return fetch(`/api/CompletedCalls`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};