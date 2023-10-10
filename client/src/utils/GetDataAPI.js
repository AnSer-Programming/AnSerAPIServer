// Used in GetClients.tsx
export const getClients = () => {
  return fetch(`/api/Clients`, {
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
export const getActiveDID = () => {
  return fetch(`/api/ActiveDID`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getActiveDIDByAccountNum = (accountNum) => {
  return fetch(`/api/ActiveDID/ByAccountNum/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getActiveDIDByName = (accountName) => {
  return fetch(`/api/ActiveDID/ByAccountName/${accountName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getActiveDIDBySource = (sourceNum) => {
  return fetch(`/api/ActiveDID/BySource/${sourceNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};
