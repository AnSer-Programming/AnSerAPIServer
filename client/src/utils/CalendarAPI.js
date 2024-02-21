//Get Data
export const getAllCalendarEvents = () => {
  return fetch(``, {
    headeres: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  });
};

//Set Data
export const setCalendarEvent = (data) => {
  return fetch(``, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};