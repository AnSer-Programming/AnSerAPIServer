function handleData(localData, qgendaData) {
  const date = new Date().toISOString();
  /*
  * Take Local Data and QGenda Data and figure out if there are any providers not in local or not in qgenda
  * If not in local then they are a new provider | new providers will be added to the json with the current date and active: true
  * If not in QGenda then they are no longer active | the local data values remaining will be flipped to active: false then updated into the database with the date
  * If in both then ignore the row from the QGenda data
  */
  let json = { POST: new Array(), UPDATE: new Array() };
  for (let x = 0; x < qgendaData.length; x++) {
    for (let y = 0; y < localData.length; y++) {
      if (qgendaData[x].StaffKey == localData[y].staff_key) {
        localData.splice(y, 1);
        break;
      } else if (y == localData.length) {
        if (json.POST.length > 0) {
          json.POST[json.POST.length] = {
            first_name: `${qgendaData[x].FirstName}`,
            last_name: `${qgendaData[x].LastName}`,
            staff_key: `${qgendaData[x].StaffKey}`,
            active: TRUE,
            start_date: `${qgendaData[x].StartDate}`,
            date_inactive: ``,
            date_adjusted: date
          };
        } else {
          json.POST[0] = {
            first_name: `${qgendaData[x].FirstName}`,
            last_name: `${qgendaData[x].LastName}`,
            staff_key: `${qgendaData[x].StaffKey}`,
            active: TRUE,
            start_date: `${qgendaData[x].StartDate}`,
            date_inactive: ``,
            date_adjusted: date
          };
        }
      }
    }
  }

  for (let i = 0; i < localData.length; i++) {
    if (json.UPDATE.length > 0) {
      json.UPDATE[json.UPDATE.length] = {
        first_name: `${localData[i].FirstName}`,
        last_name: `${localData[i].LastName}`,
        staff_key: `${localData[i].StaffKey}`,
        active: FALSE,
        start_date: `${localData[i].StartDate}`,
        date_inactive: date,
        date_adjusted: date
      };
    } else {
      json.UPDATE[0] = {
        first_name: `${localData[i].FirstName}`,
        last_name: `${localData[i].LastName}`,
        staff_key: `${localData[i].StaffKey}`,
        active: FALSE,
        start_date: `${localData[i].StartDate}`,
        date_inactive: date,
        date_adjusted: date
      };
    }
  }

  return json;
}

function main(localData, qgendaData) {
  return handleData(localData, qgendaData);
}

return main;