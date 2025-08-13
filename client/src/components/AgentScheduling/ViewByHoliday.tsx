import React, { useState, useEffect } from 'react';
import OverviewOnly from './OverviewOnly';
import SelectHoliday from './SelectHoliday';

const ViewByHoliday = (data: any) => {
  const [holiday, setHoliday] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState("None");
  const [employeeType, setEmployeeType] = useState([]);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("All");
  const [isEdit, setIsEdit] = useState(data.isEdit);
  const [holidayType, setHolidayType] = useState("Summer");
  const [agentData, setAgentData] = useState([]);
  const [viewType, setViewType] = useState("");

  useEffect(() => {
    setViewType(data.viewType);
    setHoliday(data.holiday);
    setIsEdit(data.isEdit);
    setSelectedHoliday(data.selectedHoliday);
    setEmployeeType(data.employeeType);
  }, [data]);

  const handlerChangeHoliday = (value: any) => {
    data.handlerChangeHoliday(value);
  }

  const buttonBuilder = () => {
    let buttons = new Array();
    for (let i = 0; i < employeeType.length; i++) {
      buttons.push(<button onClick={() => data.handlerChangeEmployeeTypeFilter(employeeType[i])}>{employeeType[i]}</button>);
    }

    return buttons;
  }

  return (
    <>
      <div className="mainBody">
        <h1>Current View Mode {viewType}</h1>
        <h1>Current Holiday Mode {holidayType}</h1>
        <h1>Current Holiday Selected {selectedHoliday ? selectedHoliday : "None"}</h1>
        {!isEdit ?
          <div>
            {/* <button onClick={() => data.holidayTypeHandler("Summer")} id="setToSummer">Summer Holidays</button>
            <button onClick={() => data.holidayTypeHandler("Winter")} id="setToWinter">Winter Holidays</button><br /><br /> */}
            <button onClick={() => data.handlerChangeViewType("Agent")} id="setToAgentView">View By Agent</button>
            <div style={{ width: '25%' }}>
              <SelectHoliday
                holidays={holiday}
                selectedHoliday={selectedHoliday}
                handlerChangeHoliday={(value: any) => { handlerChangeHoliday(value) }} />
            </div>
          </div>
          :
          <hr />
        }
        <p><a target="_blank" href='/HolidaySchedule'>Click here for Agent View</a></p>

        {selectedHoliday == "None" ? <OverviewOnly holidayType={holidayType} /> : <>{buttonBuilder()} <br /> <br />{data.editDisplay()}</>}
      </div>
    </>
  );
}

export default ViewByHoliday;