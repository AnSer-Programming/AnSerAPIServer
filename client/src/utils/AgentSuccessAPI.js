//Get Agents
export const getAgents = () => {
  return fetch(`/api/AgentScheduling/HolidaySignUp/GetAgents/`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

//Holiday Sign Up
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