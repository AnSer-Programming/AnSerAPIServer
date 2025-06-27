import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp, getHolidays, getAgentViewData } from '../utils/AgentSuccessAPI';
import { shiftAssigner, shiftOverview } from '../components/Utility/HolidaySignUpShiftHelper';
import SelectHoliday from '../components/AgentScheduling/SelectHoliday';

const HolidaySignUpAgentPage = () => {
  const [holiday, setHoliday] = useState<any>([]);
  const [holidayData, setHolidayData] = useState<any>();
  const [selectedHoliday, setSelectedHoliday] = useState<String>("None");
  const [agentData, setAgentData] = useState<any>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getHolidays("Winter");
        const holidays = new Array();
        const agentDataResponse = await getAgentViewData();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        for (let i = 0; i < data[0].length; i++) {
          holidays[i] = { value: data[0][i].holiday, label: data[0][i].holiday };
        }
        holidays[holidays.length] = { value: "None", label: "All" };

        data = await agentDataResponse.json();

        setAgentData(data);

        setHoliday(holidays);
        if (selectedHoliday != "None") {
          let response = await getHolidayData(selectedHoliday);
          let responseData = new Array();
          // const holidays = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[0] = await response.json();
          response = await getHolidaySignUp(selectedHoliday);

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[1] = await response.json();

          setHolidayData(responseData);
        } else {
          let response = await getHolidayData("All");
          let responseData = new Array();
          // const holidays = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[0] = await response.json();
          response = await getHolidaySignUp("All");

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[1] = await response.json();

          setHolidayData(responseData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, [selectedHoliday]);

  const contentBuilder = () => {
    console.log(agentData);
    const tableBuilder = new Array();
    let tableRowBuilder = new Array();

    if (selectedHoliday == "None") {
      for (let x = 0; x < holidayData[0].length; x++) {
        if (x > 0 && holidayData[0][x].holiday != holidayData[0][x - 1].holiday) {
          tableBuilder.push(<table className="agentViewTable"><thead><tr className="agentViewRow"><th className="agentViewTableHead" colSpan={2}>{holidayData[0][x - 1].holiday}</th></tr></thead><tbody>{tableRowBuilder}</tbody></table>);
          tableRowBuilder = new Array();
        } else if (x == holidayData[0].length - 1) {
          tableBuilder.push(<table className="agentViewTable"><thead><tr className="agentViewRow"><th className="agentViewTableHead" colSpan={2}>{holidayData[0][x].holiday}</th></tr></thead><tbody>{tableRowBuilder}</tbody></table>);
        }
        if (x == 0) {
          tableRowBuilder.push(<tr className="agentViewRow"><th className="agentViewTableHead" colSpan={2}>{holidayData[0][x].employee_type}</th></tr>);
        } else if (holidayData[0][x].employee_type != holidayData[0][x - 1].employee_type) {
          tableRowBuilder.push(<tr className="agentViewRow"><th className="agentViewTableHead" colSpan={2}>{holidayData[0][x].employee_type}</th></tr>);
        }
        for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
          if (x > 0 && holidayData[0][x].holiday != holidayData[0][x - 1].holiday && y == 0) {
            tableRowBuilder.push(<tr className="agentViewRow"><td className="agentViewTableData">New Table</td><td className="agentViewTableData">{holidayData[0][x].shift_time}</td></tr>);
          } else if (y == 0 && x == holidayData[0].length - 1) {
            tableRowBuilder.push(<tr className="agentViewRow"><td className="agentViewTableData">Last Data</td><td className="agentViewTableData">{holidayData[0][x].shift_time}</td></tr>);
          } else {
            tableRowBuilder.push(<tr className="agentViewRow"><td className="agentViewTableData">Some Data</td><td className="agentViewTableData">{holidayData[0][x].shift_time}</td></tr>);
          }
        }
      }
    } else {
      for (let x = 0; x < holidayData[0].length; x++) {
        for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
          if (x == holidayData[0].length - 1 && y == holidayData[0][x].number_of_shifts - 1) {
            tableBuilder.push(<table className="agentViewTable"><thead><tr className="agentViewRow"><th className="agentViewTableHead" colSpan={2}>{holidayData[0][x].holiday}</th></tr></thead><tbody>{tableRowBuilder}</tbody></table>);
          } else {
            tableRowBuilder.push(<tr className="agentViewRow"><td className="agentViewTableData">Some Data</td><td className="agentViewTableData">{holidayData[0][x].shift_time}</td></tr>);
          }
        }
      }
    }

    return (tableBuilder)
  }

  const blank = () => {
    return (
      <>
        <p>Unable to find schedule data</p><br />
      </>
    )
  }

  const handlerChangeHoliday = (event: any) => {
    setSelectedHoliday(event.value);
  }

  return (
    <>
      <div className="holidaySignUpAgentView">
        <div className="holidaySignUpAgentViewContentHolder">
          <div style={{ width: '20%', justifySelf: 'start' }}>
            Share this link with Agents
            <SelectHoliday
              holidays={holiday}
              selectedHoliday={selectedHoliday}
              handlerChangeHoliday={(data: any) => { handlerChangeHoliday(data) }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', width: '78%' }}>
            {holidayData ? contentBuilder() : blank()}
          </div>
        </div>
      </div>
    </>
  );
};

export default HolidaySignUpAgentPage;