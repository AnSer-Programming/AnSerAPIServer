import React, { useState, useEffect } from 'react';
import GetHolidaySignUp from '../components/AgentScheduling/GetHolidaySignUp.tsx';
import SetHolidaySignUp from '../components/AgentScheduling/SetHolidaySignUp.tsx';
import OverViewOnly from '../components/AgentScheduling/OverViewOnly.tsx'
import SelectHoliday from '../components/AgentScheduling/SelectHoliday.tsx';
import Menu from '../components/Menu';
import { getHolidays, getAgents } from '../utils/AgentSuccessAPI.js';
import { toCSV, toMSWord, toPDF } from '../components/Utility/DownloadHelper';

const HolidaySignUp = () => {
  const [holiday, setHoliday] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState("None");
  const [employeeType, setEmployeeType] = useState([]);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("All");
  const [isEdit, setIsEdit] = useState(false);
  const [holidayType, setHolidayType] = useState("Summer");
  const [agentData, setAgentData] = useState([]);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  const holidayDataLength = Object.keys(holiday).length;
  const agentDataLength = Object.keys(agentData).length;

  useEffect(() => {
    const getHolidayData = async () => {
      try {
        const response = await getHolidays(holidayType);
        const holidays = new Array();
        const employeeTypes = new Array();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        for (let i = 0; i < data[0].length; i++) {
          holidays[i] = { value: data[0][i].holiday, label: data[0][i].holiday };
        }
        for (let i = 0; i < data[1].length; i++) {
          employeeTypes[i] = data[1][i].employee_type;
        }

        holidays[holidays.length] = { value: "None", label: "None" };
        employeeTypes[employeeTypes.length] = "All";

        setEmployeeType(employeeTypes);
        setHoliday(holidays);
      } catch (err) {
        console.error(err);
      }
    }

    const getAgentData = async () => {
      try {
        if (selectedHoliday != "None") {
          let response = await getAgents(selectedEmployeeType);
          let responseData;
          let agents = new Array();
          // const holidays = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData = await response.json();

          agents.push({ value: "Available", label: "Available" });
          for (let i = 0; i < responseData.length; i++) {
            agents.push({ value: responseData[i].Agent_name, label: responseData[i].Agent_name })
          }
          agents.push({ value: "Available", label: "Available" });

          setAgentData(agents);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getHolidayData();
    getAgentData();
  }, [holidayDataLength, agentDataLength, holidayType, selectedHoliday, selectedEmployeeType]);

  const editDisplay = () => {
    return (
      <>
        <div>
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br />
        </div>
        {
          isEdit ?
            <SetHolidaySignUp
              selectedHoliday={selectedHoliday}
              selectedEmployeeType={selectedEmployeeType}
              agentData={agentData}
              setEdit={(editBoolean) => setIsEdit(editBoolean)} /> :
            <div>
              {/* Download buttons go here */}
              <GetHolidaySignUp
                selectedHoliday={selectedHoliday}
                selectedEmployeeType={selectedEmployeeType} />
            </div>
        }
      </>
    )
  }

  const downloadHelper = (downloadType) => {
    const fileName = `${holidayType}HolidaySchedule2025`;
    switch (downloadType) {
      case "CSV":

        break;
      case "Word":

        break;
      case "PDF":

        break;
      default:
        break;
    }
  }

  const handlerChangeHoliday = (event) => {
    setSelectedHoliday(event.value);
  }

  const handlerChangeEmployeeTypeFilter = (event) => {
    setSelectedEmployeeType(event);
  }

  const editingHandler = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }

  const holidayTypeHandler = (value) => {
    if (holidayType != value) {
      setHolidayType(value);
      setSelectedHoliday("None");
    }
  }

  const buttonBuilder = () => {
    let buttons = new Array();
    for (let i = 0; i < employeeType.length; i++) {
      buttons.push(<button onClick={() => handlerChangeEmployeeTypeFilter(employeeType[i])}>{employeeType[i]}</button>);
    }

    return buttons;
  }

  return (
    <>
      <Menu
        page="Holiday Sign Up" />
      <div style={{ height: '90vh', width: '100%', padding: '5px', overflow: 'auto' }}>
        <h1>Current Holiday Mode {holidayType}</h1>
        <h1>Current Holiday Selected {selectedHoliday ? selectedHoliday : "None"}</h1>
        {!isEdit ?
          <div>
            <button onClick={() => holidayTypeHandler("Summer")} id="setToSummer">Summer Holidays</button>
            <button onClick={() => holidayTypeHandler("Winter")} id="setToWinter">Winter Holidays</button>
            <div style={{ width: '25%' }}>
              <SelectHoliday
                holidays={holiday}
                selectedHoliday={selectedHoliday}
                handlerChangeHoliday={(data) => { handlerChangeHoliday(data) }} />
            </div>
          </div>
          :
          <hr />
        }
        <p><a target="_blank" href='/HolidaySchedule'>Click here for Agent View</a></p>

        {selectedHoliday == "None" ? <OverViewOnly holidayType={holidayType} /> : <>{buttonBuilder()} <br /> <br />{editDisplay()}</>}
      </div>
    </>
  );
};

export default HolidaySignUp;