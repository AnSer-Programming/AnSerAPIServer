import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp, getAgentsBySenority } from '../../utils/AgentSuccessAPI';

const AgentOverview = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>({});
  const [takenShiftData, setTakenShiftData] = useState<any>({});
  const [agentsBySenority, setAgentsBySenority] = useState<any>([]);
  const takenShiftDataLength = Object.keys(takenShiftData).length;
  const holidayDataLength = Object.keys(holidayData).length;

  useEffect(() => {
    const getData = async () => {
      let response = new Array();
      let returnData;
      response[0] = await getHolidayData("All");
      response[1] = await getHolidaySignUp(data.holidayType);
      response[2] = await getAgentsBySenority();

      returnData = await response[0].json();
      setHolidayData(returnData);

      returnData = await response[1].json();
      setTakenShiftData(returnData);

      returnData = await response[2].json();
      setAgentsBySenority(returnData[0]);
    }

    getData();
  }, [data.holidayType, takenShiftDataLength, holidayDataLength]);

  const shiftOverviewBuilder = () => {
    let table: any[] = new Array();
    let tableRows: any[] = new Array();
    let agents: any[] = new Array();
    let dispatchers: any[] = new Array();
    let supervisors: any[] = new Array();

    for (let i = 0; i < agentsBySenority.length; i++) {
      if (agentsBySenority[i].JobTitle == "Supervisor") {
        supervisors.push({senorityRank: i, agentData: agentsBySenority[i]});
      } else if (agentsBySenority[i].JobTitle == "Agent" && agentsBySenority[i].Dispatcher) {
        dispatchers.push({senorityRank: i, agentData: agentsBySenority[i]});
      } else {
        agents.push({senorityRank: i, agentData: agentsBySenority[i]});
      }
    }

    for (let x = 0; x < agents.length; x++) {
      let numberOfShifts: number = 0;
      let agentShifts: any[] = new Array();
      for (let y = 0; y < takenShiftData.length; y++) {
        if (takenShiftData[y].agent_name == agents[x].agentData.Agent_name) {
          agentShifts[numberOfShifts] = takenShiftData[y];
          numberOfShifts++;
        }
      }

      if (agentShifts.length > 0) {
        for (let y = 0; y < numberOfShifts; y++) {
          if (y == 0) {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport" rowSpan={numberOfShifts}>{agents[x].agentData.Agent_name}</td>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].shift_time}</td>
              </tr>
            );
          } else {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{agentShifts[y].shift_time}</td>
              </tr>
            );
          }
        }
      } else {
        tableRows.push(
          <tr>
            <td className="holidaySignUpItemAgentReport">{agents[x].agentData.Agent_name}</td>
            <td className="holidaySignUpItemAgentReport noAssignedShifts" colSpan={3}>No Assigned Shifts</td>
          </tr>
        );
      }
    }

    table.push(
      <div style={{ width: '32%' }}>
        <table className="holidaySignUpReview"><thead>
          <tr>
            <th className="holidaySignUpItemAgentReportHeader" colSpan={4}>Agents</th>
          </tr>
        </thead>
          <tbody>
            <tr>
              <td className="holidaySignUpItemAgentReport">Name</td>
              <td className="holidaySignUpItemAgentReport">Holiday</td>
              <td className="holidaySignUpItemAgentReport">Shift Date</td>
              <td className="holidaySignUpItemAgentReport">Shift Time</td>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>);

    tableRows = new Array();

    for (let x = 0; x < dispatchers.length; x++) {
      let numberOfShifts: number = 0;
      let dispatcherShifts: any[] = new Array();
      for (let y = 0; y < takenShiftData.length; y++) {
        if (takenShiftData[y].agent_name == dispatchers[x].agentData.Agent_name) {
          dispatcherShifts[numberOfShifts] = takenShiftData[y];
          numberOfShifts++;
        }
      }

      if (dispatcherShifts.length > 0) {
        for (let y = 0; y < numberOfShifts; y++) {
          if (y == 0) {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport" rowSpan={numberOfShifts}>{dispatchers[x].agentData.Agent_name}</td>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].shift_time}</td>
              </tr>
            );
          } else {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{dispatcherShifts[y].shift_time}</td>
              </tr>
            );
          }
        }
      } else {
        tableRows.push(
          <tr>
            <td className="holidaySignUpItemAgentReport">{dispatchers[x].agentData.Agent_name}</td>
            <td className="holidaySignUpItemAgentReport noAssignedShifts" colSpan={3}>No Assigned Shifts</td>
          </tr>
        );
      }
    }

    table.push(
      <div style={{ width: '32%' }}>
        <table className="holidaySignUpReview"><thead>
          <tr>
            <th className="holidaySignUpItemAgentReportHeader" colSpan={4}>Dispatchers</th>
          </tr>
        </thead>
          <tbody>
            <tr>
              <td className="holidaySignUpItemAgentReport">Name</td>
              <td className="holidaySignUpItemAgentReport">Holiday</td>
              <td className="holidaySignUpItemAgentReport">Shift Date</td>
              <td className="holidaySignUpItemAgentReport">Shift Time</td>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>);

    tableRows = new Array();

    for (let x = 0; x < supervisors.length; x++) {
      let numberOfShifts: number = 0;
      let supervisorShifts: any[] = new Array();
      for (let y = 0; y < takenShiftData.length; y++) {
        if (takenShiftData[y].agent_name == supervisors[x].agentData.Agent_name) {
          supervisorShifts[numberOfShifts] = takenShiftData[y];
          numberOfShifts++;
        }
      }

      if (supervisorShifts.length > 0) {
        for (let y = 0; y < numberOfShifts; y++) {
          if (y == 0) {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport" rowSpan={numberOfShifts}>{supervisors[x].agentData.Agent_name}</td>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].shift_time}</td>
              </tr>
            );
          } else {
            tableRows.push(
              <tr>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].holiday}</td>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].holiday_date}</td>
                <td className="holidaySignUpItemAgentReport">{supervisorShifts[y].shift_time}</td>
              </tr>
            );
          }
        }
      } else {
        tableRows.push(
          <tr>
            <td className="holidaySignUpItemAgentReport">{supervisors[x].agentData.Agent_name}</td>
            <td className="holidaySignUpItemAgentReport" colSpan={3}>No Assigned Shifts</td>
          </tr>
        );
      }
    }

    table.push(
      <div style={{ width: '32%' }}>
        <table className="holidaySignUpReview">
          <thead>
            <tr>
              <th className="holidaySignUpItemAgentReportHeader" colSpan={4}>Supervisors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="holidaySignUpItemAgentReport">Name</td>
              <td className="holidaySignUpItemAgentReport">Holiday</td>
              <td className="holidaySignUpItemAgentReport">Shift Date</td>
              <td className="holidaySignUpItemAgentReport">Shift Time</td>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    );

    return (table);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {holidayData && takenShiftData ? shiftOverviewBuilder() : <br />}
      </div>
    </>
  );
}

export default AgentOverview;