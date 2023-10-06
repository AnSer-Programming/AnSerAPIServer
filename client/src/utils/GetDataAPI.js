// Active Agent API Call
export const getClients = () => {
  return fetch(`/api/clients`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectories = () => {
  return fetch(`/api/clientsAndDirectories`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByNum = (accountNum) => {
  return fetch(`/api/clientsAndDirectories/ByNumber/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByName = (accountName) => {
  return fetch(`/api/clientsAndDirectories/ByName/${accountName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/clientsAndDirectories/ByDirectory/${directoryName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};