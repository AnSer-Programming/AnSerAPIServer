// Used in GetClients.tsx, GetDirectoryContactsAndInfoCards.tsx
export const getClients = () => {
  return fetch(`/api/Clients`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClients.tsx
export const getClientsByNum = (accountNum) => {
  return fetch(`/api/Clients/ByAccountNum/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsByName = (accountName) => {
  return fetch(`/api/Clients/ByAccountName/${accountName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientsDirectories.tsx
export const getClientsDirectories = () => {
  return fetch(`/api/ClientsAndDirectories`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByNum = (accountNum) => {
  return fetch(`/api/ClientsAndDirectories/ByNumber/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByName = (accountName) => {
  return fetch(`/api/ClientsAndDirectories/ByName/${accountName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getClientsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/ClientsAndDirectories/ByDirectory/${directoryName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientsDirectories.tsx
export const getContactsDirectories = () => {
  return fetch(`/api/ContactsAndDirectories`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByPersonName = (personName) => {
  return fetch(`/api/ContactsAndDirectories/ByPersonName/${personName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getContactsDirectoriesByDirectory = (directoryName) => {
  return fetch(`/api/ContactsAndDirectories/ByDirectoryName/${directoryName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetActiveDID.tsx
export const getDID = () => {
  return fetch(`/api/GetDID`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDByAccountNum = (accountNum) => {
  return fetch(`/api/GetDID/ByAccountNum/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDByName = (accountName) => {
  return fetch(`/api/GetDID/ByAccountName/${accountName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getDIDBySource = (sourceNum) => {
  return fetch(`/api/GetDID/BySource/${sourceNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetDirectoryContactsAndInfoCards.tsx
export const getDirectoryContactsAndInfoCards = (accountNum) => {
  return fetch(`/api/DirectoryContactsAndInfoCards/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetInfoPages.tsx
export const getInfoPages = (accountNum) => {
  return fetch(`/api/InfoPages/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetAgentSupervisor.tsx
export const getAgentSupervisor = () => {
  return fetch(`/api/AgentSupervisor`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetProviders.tsx
// if the group has a value then pass the value otherwise pass nothing
export const getProviders = (group) => {
  return fetch(`/api/GetProviders/${group ? group : ''}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClientContactsAndRoles.tsx
export const getClientContactsAndRoles = (accountNum) => {
  return fetch(`/api/GetClientContactsAndRoles/ByAccountNum/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetMailGunFailedEvents.tsx
export const getMailGunFailedEvents = () => {
  return fetch(`/api/MailGun/Events`, {
    headers: {
      method: 'GET',
      'Contect-Type': 'application/json',
    },
  });
};

// Used in GetISHolidays.tsx, GetDirectoryContactsAndInfoCards.tsx
export const getISHolidays = () => {
  return fetch(`/api/ISHolidays`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

// Used in GetClients.tsx
export const getISHolidaysByNum = (accountNum) => {
  return fetch(`/api/ISHolidays/ByAccountNum/${accountNum}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

export const getISHolidaysByName = (accountName) => {
  return fetch(`/api/ISHolidays/ByAccountName/${accountName}`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};