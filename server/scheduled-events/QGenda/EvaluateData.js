function handleData(localData, qgendaData) {
  const date = new Date();
  let found;
  /*
  * Take Local Data and QGenda Data and figure out if there are any providers not in local or not in qgenda
  * If not in local then they are a new provider | new providers will be added to the json with the current date and active: true
  * If not in QGenda then they are no longer active | the local data values remaining will be flipped to active: false then updated into the database with the date
  * If in both then ignore the row from the QGenda data
  */
  let json = { POST: new Array(), UPDATE: new Array() };
  for (let x = 0; x < qgendaData.length; x++) {
    found = false;
    const startDate = new Date(qgendaData[x].StartDate);
    const dataLenght = localData.length;
    if (localData.length > 0) {
      for (let y = 0; y < dataLenght; y++) {
        if (localData[y]) {
          if (qgendaData[x].StaffKey == localData[y].staff_key) {
            delete localData[y];
            found = true;
            break;
          } else if (y == dataLenght && !found) {
            if (json.POST.length > 0) {
              json.POST[json.POST.length] = {
                first_name: `${qgendaData[x].FirstName.replace(/'/g, '')}`,
                last_name: `${qgendaData[x].LastName.replace(/'/g, '')}`,
                staff_key: `${qgendaData[x].StaffKey}`,
                active: "TRUE",
                start_date: `${startDate.toLocaleDateString()}`,
                date_inactive: null,
                date_adjusted: date.toLocaleDateString()
              };
            } else {
              json.POST[0] = {
                first_name: `${qgendaData[x].FirstName.replace(/'/g, '')}`,
                last_name: `${qgendaData[x].LastName.replace(/'/g, '')}`,
                staff_key: `${qgendaData[x].StaffKey}`,
                active: "TRUE",
                start_date: `${startDate.toLocaleDateString()}`,
                date_inactive: null,
                date_adjusted: date.toLocaleDateString()
              };
            }
          }
        }
      }
    } else {
      if (json.POST.length > 0) {
        json.POST[json.POST.length] = {
          first_name: `${qgendaData[x].FirstName.replace(/'/g, '')}`,
          last_name: `${qgendaData[x].LastName.replace(/'/g, '')}`,
          staff_key: `${qgendaData[x].StaffKey}`,
          active: "TRUE",
          start_date: `${startDate.toLocaleDateString()}`,
          date_inactive: null,
          date_adjusted: date.toLocaleDateString()
        };
      } else {
        json.POST[0] = {
          first_name: `${qgendaData[x].FirstName.replace(/'/g, '')}`,
          last_name: `${qgendaData[x].LastName.replace(/'/g, '')}`,
          staff_key: `${qgendaData[x].StaffKey}`,
          active: "TRUE",
          start_date: `${startDate.toLocaleDateString()}`,
          date_inactive: null,
          date_adjusted: date.toLocaleDateString()
        };
      }
    }
  }

  for (let i = 0; i < localData.length; i++) {
    if (localData[i]) {
      const startDate = new Date(localData[i].StartDate);
      if (localData[i] != null) {
        if (json.UPDATE.length > 0) {
          json.UPDATE[json.UPDATE.length] = {
            first_name: `${localData[i].first_name}`,
            last_name: `${localData[i].last_name}`,
            staff_key: `${localData[i].staff_key}`,
            active: "FALSE",
            start_date: `${startDate.toLocaleDateString()}`,
            date_inactive: date.toLocaleDateString(),
            date_adjusted: date.toLocaleDateString()
          };
        } else {
          json.UPDATE[0] = {
            first_name: `${localData[i].first_name}`,
            last_name: `${localData[i].last_name}`,
            staff_key: `${localData[i].staff_key}`,
            active: "FALSE",
            start_date: `${startDate.toLocaleDateString()}`,
            date_inactive: date.toLocaleDateString(),
            date_adjusted: date.toLocaleDateString()
          };
        }
      }
    }
  }

  return json;
}

const main = async (localData, qgendaData) => {
  return await handleData(localData, qgendaData);
}

module.exports = { main };