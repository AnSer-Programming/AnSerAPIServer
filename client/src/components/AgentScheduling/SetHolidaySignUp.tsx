import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp, setShiftData, updateShiftData, removeShiftData } from '../../utils/AgentSuccessAPI';
import SelectAgent from './SelectAgent';
import { shiftAssigner } from '../Utility/HolidaySignUpShiftHelper';

const SetHolidaySignUp = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>([]);
  const [updateData, setUpdateData] = useState<any>([]);
  const [shiftData, setAssignedShiftData] = useState<any>([]);
  const holidayDataLength = Object.keys(holidayData).length;
  const updateDataLength = Object.keys(updateData).length;
  let newData: any = 0;

  useEffect(() => {
    const getCompleteHolidayData = async () => {
      try {
        if (data.selectedHoliday != "None") {
          let response = await getHolidayData(data.selectedHoliday);
          let responseData = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[0] = await response.json();
          response = await getHolidaySignUp(data.selectedHoliday);

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[1] = await response.json();

          setHolidayData(responseData);
          setAssignedShiftData(await shiftAssigner(responseData));
        }
      } catch (err) {
        console.error(err);
      }
    }

    getCompleteHolidayData();
  }, [holidayDataLength, data.selectedHoliday, data.selectedEmployeeType]);

  const handlerChangeAgent = async (newValue: any, holidayID: number, shiftID: number) => {
    if (newValue.value == "Available") {
      const results = await removeShiftData(shiftID);
      setUpdateData(await results.json());
    } else {
      if (shiftID == -1) {
        newData = { agentName: `${newValue.value}`, holidayID: holidayID };
        const results = await setShiftData(newData);
        setUpdateData(await results.json());
      } else {
        newData = { agentName: `${newValue.value}`, id: shiftID };
        const results = await updateShiftData(newData);
        setUpdateData(await results.json());
      }
    }
  }

  const listBuilder = () => {
    let shiftList = new Array();
    if (data.selectedHoliday == "None") {
      shiftList.push(<tr><td></td></tr>);
    } else {
      if (shiftData.length > 0) {
        for (let x = 0; x < shiftData.length; x++) {
          if (data.selectedEmployeeType == "All") {
            if (x > 1) {
              if (shiftData[x].employeeType != shiftData[x - 1].employeeType) {
                shiftList.push(<hr />)
              }
            }
            shiftList.push(
              <tr>
                <td>Employee Type: {shiftData[x].employeeType}</td>
                <td>Holiday: {shiftData[x].holiday}</td>
                <td>Shift Time: {shiftData[x].shiftTime}</td>
                <td style={{ width: '45%' }}>
                  Agent Name: <SelectAgent
                    agents={data.agentData}
                    selectedAgent={shiftData[x].agentName}
                    holidayID={shiftData[x].holidayID}
                    shiftID={shiftData[x].shiftID}
                    handlerChangeAgent={(change: any, holidayID: number, shiftID: number) => handlerChangeAgent(change, holidayID, shiftID)} />
                </td>
              </tr>
            );
          } else {
            if (shiftData[x].employeeType == data.selectedEmployeeType) {
              shiftList.push(
                <tr>
                  <td>Employee Type: {shiftData[x].employeeType}</td>
                  <td>Holiday: {shiftData[x].holiday}</td>
                  <td>Shift Time: {shiftData[x].shiftTime}</td>
                  <td style={{ width: '45%' }}>
                    Agent Name: <SelectAgent
                      agents={data.agentData}
                      selectedAgent={shiftData[x].agentName}
                      holidayID={shiftData[x].holidayID}
                      shiftID={shiftData[x].shiftID}
                      handlerChangeAgent={(change: any, holidayID: number, shiftID: number) => handlerChangeAgent(change, holidayID, shiftID)} />
                  </td>
                </tr>
              );
            }
          }
        }
      }
    }

    return shiftList;
  }

  return (
    <>
      <table style={{ width: '60%' }}>
        <tbody>
          {listBuilder()}
        </tbody>
      </table>
    </>
  )
}

export default SetHolidaySignUp;