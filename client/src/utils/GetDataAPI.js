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

export const getClientDirectory = (accountNum) => {
  console.log(accountNum);
  return fetch(`/api/clientsAndDirectories/${accountNum}`, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};