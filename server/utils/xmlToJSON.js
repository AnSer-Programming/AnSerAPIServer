const basementRepairSpecialistsAppointments = async(data, today) => {
  let appointmentsObj = {
    entry: [{
      id: '',
      updated: '',
      content: {
        properties: {
          id: '',
          appointmentDate: '',
          appointmentDate: '',
          appointmentStartTime: '',
          appointmentEndTime: '',
          salesPerson1Id: '',
          salesPerson1: '',
          type: '',
        },
      },
    }]
  };

  let splitData = data.replaceAll('\r', '').split('<entry>');

  for(let x = 0; x < splitData.length; x++) {
    splitData[x] = await splitData[x].split('\n');
    appointmentsObj.entry[x] = {
      id: '',
      updated: '',
      content: {
        properties: {
          id: '',
          appointmentDateTime: '',
          appointmentDate: '',
          appointmentStartTime: '',
          appointmentEndTime: '',
          salesPerson1Id: '',
          salesPerson1: '',
          type: '',
        },
      },
    };

    for(let y = 0; y < splitData[x].length; y++) {
      if(splitData[x][y].includes(`<id>`)) {
        appointmentsObj.entry[x].id = splitData[x][y].split(`<id>`)[1].split(`</id>`)[0];
      }
      if(splitData[x][y].includes('<updated>')) {
        appointmentsObj.entry[x].updated = splitData[x][y].split(`<updated>`)[1].split(`</updated>`)[0];
      }
      if(splitData[x][y].includes('<d:id>')) {
        appointmentsObj.entry[x].content.properties.id = splitData[x][y].split(`<d:id>`)[1].split(`</d:id>`)[0];
      }
      if(splitData[x][y].includes('<d:appointmentDate m:type="Edm.DateTime">')) {
        appointmentsObj.entry[x].content.properties.appointmentDateTime = splitData[x][y].split(`<d:appointmentDate m:type="Edm.DateTime">`)[1].split(`</d:appointmentDate>`)[0];
        appointmentsObj.entry[x].content.properties.appointmentDate = appointmentsObj.entry[x].content.properties.appointmentDateTime.split(`T`)[0];
        appointmentsObj.entry[x].content.properties.appointmentStartTime = appointmentsObj.entry[x].content.properties.appointmentDateTime.split(`T`)[1].split(`-`)[0];
        appointmentsObj.entry[x].content.properties.appointmentEndTime = parseInt(appointmentsObj.entry[x].content.properties.appointmentStartTime.replace(':', '')) + 229;
        if(appointmentsObj.entry[x].content.properties.appointmentEndTime.toString().length < 4) {
          appointmentsObj.entry[x].content.properties.appointmentEndTime = `0${appointmentsObj.entry[x].content.properties.appointmentEndTime}`;
        } else {
          appointmentsObj.entry[x].content.properties.appointmentEndTime = `${appointmentsObj.entry[x].content.properties.appointmentEndTime}`;
        }
        appointmentsObj.entry[x].content.properties.appointmentEndTime = `${appointmentsObj.entry[x].content.properties.appointmentEndTime.slice(0,2)}:${appointmentsObj.entry[x].content.properties.appointmentEndTime.slice(2,4)}`
      }
      if(splitData[x][y].includes('<d:salesperson1Id>')) {
        appointmentsObj.entry[x].content.properties.salesPerson1Id = splitData[x][y].split(`<d:salesperson1Id>`)[1].split(`</d:salesperson1Id>`)[0];
        if(appointmentsObj.entry[x].content.properties.salesPerson1Id ==='b797869d-77e0-4041-9daf-b17cec2b8385') {
          appointmentsObj.entry[x].content.properties.salesPerson1 = 'Bob Reber';
        } else if(appointmentsObj.entry[x].content.properties.salesPerson1Id === `0779f323-0a54-48b1-bdda-0fa8066e9cd4`) {
          appointmentsObj.entry[x].content.properties.salesPerson1 = 'Dan Frost';
        } else {
          appointmentsObj.entry[x].content.properties.salesPerson1 = 'Unlisted';
        }
      }
      if(splitData[x][y].includes('<d:type>')) {
        appointmentsObj.entry[x].content.properties.type = splitData[x][y].split(`<d:type>`)[1].split(`</d:type>`)[0];
      }
    }
    if(appointmentsObj.entry[x].content.properties.appointmentDate) {
      if(parseInt(appointmentsObj.entry[x].content.properties.appointmentDate.split('-')[1]) <= parseInt(today.split('-')[1])) {
        if(parseInt(appointmentsObj.entry[x].content.properties.appointmentDate.split('-')[2]) <= parseInt(today.split('-')[2])) {
          appointmentsObj.entry.splice(x, 1);
          appointmentsObj.entry.splice(0, 1);
          break;
        }
      }
    }
  }

  return appointmentsObj;
}

module.exports = { basementRepairSpecialistsAppointments };