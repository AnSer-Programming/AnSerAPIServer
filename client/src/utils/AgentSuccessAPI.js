//Get Agents
export const getAgents = (agentType) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetAgents/${agentType}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getAgentReportData = (data) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/AgentSignUpReport/${data}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getAgentsBySenority = () => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetAgents/BySenority`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

//Holiday Sign Up
export const getAgentViewData = (holidayType, holiday) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetAgentViewData/${holidayType}/${holiday}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getHolidays = (holidayType) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/${holidayType}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getHolidayData = (holiday) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetHolidayData/${holiday}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getHolidaySignUp = (holiday) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetSignedUp/${holiday}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setShiftData = (data) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/AssignShift`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateShiftData = (data) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/UpdateShift`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const removeShiftData = (data) => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/RemoveShift/${data}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};