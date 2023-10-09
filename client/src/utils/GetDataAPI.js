// Active Agent API Call
export const getClients = () => {
  return fetch(`/api/clients`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientsDirectories.tsx
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

// Used in GetClientsDirectories.tsx
export const getContactsDirectories = () => {
  return fetch(`/api/contactsAndDirectories`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByPersonName = (personName) => {
  return fetch(`/api/contactsAndDirectories/ByPersonName/${personName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/contactsAndDirectories/ByDirectoryName/${directoryName}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};