// Used in GetClients.tsx
export const getClients = () => {
  return fetch(`/api/Clients`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsByNum = (accountNum) => {
  return fetch(`/api/Clients/ByAccountNum/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsByName = (accountName) => {
  return fetch(`/api/Clients/ByAccountName/${accountName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientsDirectories.tsx
export const getClientsDirectories = () => {
  return fetch(`/api/ClientsAndDirectories`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByNum = (accountNum) => {
  return fetch(`/api/ClientsAndDirectories/ByNumber/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByName = (accountName) => {
  return fetch(`/api/ClientsAndDirectories/ByName/${accountName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/ClientsAndDirectories/ByDirectory/${directoryName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientsDirectories.tsx
export const getContactsDirectories = () => {
  return fetch(`/api/ContactsAndDirectories`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByPersonName = (personName) => {
  return fetch(`/api/ContactsAndDirectories/ByPersonName/${personName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/ContactsAndDirectories/ByDirectoryName/${directoryName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetActiveDID.tsx
export const getDID = () => {
  return fetch(`/api/GetDID`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDByAccountNum = (accountNum) => {
  return fetch(`/api/GetDID/ByAccountNum/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDByName = (accountName) => {
  return fetch(`/api/GetDID/ByAccountName/${accountName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDBySource = (sourceNum) => {
  return fetch(`/api/GetDID/BySource/${sourceNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};
