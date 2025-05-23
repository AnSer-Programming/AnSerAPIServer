import React, { useState, useEffect } from 'react';
import GetHolidaySignUp from '../components/AgentScheduling/GetHolidaySignUp.tsx';
import SetHolidaySignUp from '../components/AgentScheduling/SetHolidaySignUp.tsx';
import SelectHoliday from '../components/AgentScheduling/SelectHoliday.tsx';
import Menu from '../components/Menu';
import { getHolidays, getAgents } from '../utils/AgentSuccessAPI.js';

const HolidaySignUp = () => {
  const [holiday, setHoliday] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState("None");
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

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        for (let i = 0; i < data.length; i++) {
          holidays[i] = { value: data[i].holiday, label: data[i].holiday };
        }

        holidays[holidays.length] = { value: "None", label: "None" };

        setHoliday(holidays);
      } catch (err) {
        console.error(err);
      }
    }

    const getAgentData = async () => {
      try {
        if (selectedHoliday != "None") {
          let response = await getAgents();
          let responseData;
          let agents = new Array();
          // const holidays = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData = await response.json();

          for (let i = 0; i < responseData.length; i++) {
            agents.push({ value: responseData[i].Agent_Name, label: responseData[i].Agent_Name })
          }
          agents.push({ value: "Available", label: "Available" })

          setAgentData(agents);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getHolidayData();
    getAgentData();
  }, [holidayDataLength, agentDataLength, holidayType, selectedHoliday]);

  const editDisplay = () => {
    return (
      <>
        <div>
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br />
        </div>
        {
          isEdit ?
            <SetHolidaySignUp
              selectedHoliday = {selectedHoliday}
              agentData = {agentData}
              setEdit={(editBoolean) => setIsEdit(editBoolean)} /> :
            <GetHolidaySignUp
              selectedHoliday = {selectedHoliday} />
        }
      </>
    )
  }

  const handlerChangeHoliday = (event) => {
    console.log(event);
    setSelectedHoliday(event.value);
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
    for(let i = 0; i < holiday.length; i++) {
      buttons.push(<button onClick={() => handlerChangeHoliday(holiday[i])}>{holiday[i].value}</button>);
    }
     //adjust buttons to be a filter between Agent, Dispatcher, and Supervisor shifts instead of holiday buttons

    return buttons;
  }

  return (
    <>
      <Menu
        page="Holiday Sign Up" />
      <div style={{ height: '90vh', width: '100%', padding: '5px', overflow: 'auto' }}>
        <h1>Current Holiday Mode {holidayType}</h1>
        <h1>Current Holiday Selected {selectedHoliday ? selectedHoliday : "None"}</h1>
        <button onClick={() => holidayTypeHandler("Summer")} id="setToSummer">Summer Holidays</button>
        <button onClick={() => holidayTypeHandler("Winter")} id="setToWinter">Winter Holidays</button>
        <SelectHoliday
          holidays = {holiday}
          selectedHoliday = {selectedHoliday}
          handlerChangeHoliday = {(data) => {handlerChangeHoliday(data)}} />
        <p>Please share this link with Agents so they can review the holiday shifts that they have been signed up for <a target="_blank" href='/HolidaySchedule'>Agent View</a></p>
      
        {buttonBuilder()}
        {editDisplay()}
      </div>
    </>
  );
};

export default HolidaySignUp;