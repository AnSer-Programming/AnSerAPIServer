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
export const getVesselsDBAPI = (accountNum) => {
  return fetch(`/api/VesselDB/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setVesselsDBAPI = (data) => {
  return fetch(`/api/VesselDB`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getSingleVesselContactDB = (index) => {
  return fetch(`/api/VesselDB/ByIndex/${index}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateVesselsDBAPI = (index, data) => {
  return fetch(`/api/VesselDB/ByIndex/${index}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteVesselsDBAPI = (index, data) => {
  return fetch(`/api/VesselDB/ByIndex/${index}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Contact Dispatch List Calls
export const getContactDispatchAPI = () => {
  return fetch(`/api/ContactDispatch`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getGroupContactDispatchAPI = (groupNum) => {
  console.log(groupNum)
  return fetch(`/api/ContactDispatch/${groupNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setContactDispatchAPI = (data) => {
  return fetch(`/api/ContactDispatch/updateClient`, {
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
    headers: {
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

// Resident Directory API Call
export const getResidentDirectoryAPI = (accountNum) => {
  return fetch(`/api/ResidentDirectory/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setResidentDirectoryAPI = (accountNum, data) => {
  return fetch(`/api/ResidentDirectory/${accountNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Crescent Electric API Calls
export const getReachList = () => {
  return fetch(`/api/CrescentElectricReachList`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getReachListRowByBranch = (branch) => {
  return fetch(`/api/CrescentElectricReachList/ByBranch/${branch}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getReachListRowByID = (id) => {
  return fetch(`/api/CrescentElectricReachList/ByBranch/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postToReachList = (data) => {
  return fetch(`/api/CrescentElectricReachList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateReachList = (id, data) => {
  return fetch(`/api/CrescentElectricReachList/ByID/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteReachListRow = (id, data) => {
  return fetch(`/api/CrescentElectricReachList/ByID/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Scheduler API Call
export const getSchedulerAPI = (accountNum) => {
  return fetch(`/api/Scheduler/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const setSchedulerAPI = (accountNum, data) => {
  return fetch(`/api/Scheduler/${accountNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const sendEmailReportIssueFeedback = (data) => {
  return fetch(`/api/ReportIssueFeedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}