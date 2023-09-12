// Get Data For the OnTime Graph
export const onTimeData = () => {
  return fetch('/api/OnTime', {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Vessel API Calls
export const getVesselsAPI = (accountNum) => {
  return fetch(`/api/Vessel/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setVesselsAPI = (accountNum, data) => {
  return fetch(`/api/Vessel/${accountNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Contact Dispatch List Calls
export const getContactDispatchAPI = () => {
  return fetch(`/api/ContactDispatch`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getGroupContactDispatchAPI = (groupNum) => {
  console.log(groupNum)
  return fetch(`/api/ContactDispatch/${groupNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setContactDispatchAPI = (data) => {
  return fetch(`/api/ContactDispatch`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Disconnect List API Calls
export const getDisconnectListAPI = (accountNum) => {
  return fetch(`/api/DisconnectList/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setDisconnectListAPI = (accountNum, data) => {
  return fetch(`/api/DisconnectList/${accountNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};