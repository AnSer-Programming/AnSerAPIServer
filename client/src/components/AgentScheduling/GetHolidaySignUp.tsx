import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp } from '../../utils/AgentSuccessAPI';

const GetHolidaySignUp = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>([]);
  const holidayDataLength = Object.keys(holidayData).length;

  useEffect(() => {
    const getCompleteHolidayData = async () => {
      try {
        if (data.selectedHoliday != "None") {
          let response = await getHolidayData(data.selectedHoliday);
          let responseData = new Array();
          // const holidays = new Array();

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
        }
      } catch (err) {
        console.error(err);
      }
    }

    getCompleteHolidayData();
  }, [holidayDataLength, data.selectedHoliday]);

  const listBuilder = () => {
    let signedUpCounter: number = 0;
    let shiftList = new Array();
    if (data.selectedHoliday == "None") {
      shiftList.push(<tr><td></td></tr>);
    } else {
      if (holidayData.length > 0) {
        for (let x = 0; x < holidayData[0].length; x++) {
          for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
            if (x > 1 && y == 0) {
              if (holidayData[0][x].employee_type != holidayData[0][x - 1].employee_type) {
                shiftList.push(<hr />)
              }
            }
            if (holidayData[1].length > 0) {
              if (holidayData[1][signedUpCounter]) {
                if (holidayData[0][x].id === holidayData[1][signedUpCounter].holiday_id && signedUpCounter < holidayData[1].length) {
                  shiftList.push(<tr><td>Employee Type: {holidayData[0][x].employee_type}</td><td>Holiday: {holidayData[0][x].holiday}</td><td>Shift Time: {holidayData[0][x].shift_time}</td><td>Agent Name: {holidayData[1][signedUpCounter].agent_name}</td></tr>);
                  signedUpCounter++;
                } else {
                  shiftList.push(<tr><td>Employee Type: {holidayData[0][x].employee_type}</td><td>Holiday: {holidayData[0][x].holiday}</td><td>Shift Time: {holidayData[0][x].shift_time}</td><td>Agent Name: <strong>Available</strong></td></tr>);
                }
              } else {
                shiftList.push(<tr><td>Employee Type: {holidayData[0][x].employee_type}</td><td>Holiday: {holidayData[0][x].holiday}</td><td>Shift Time: {holidayData[0][x].shift_time}</td><td>Agent Name: <strong>Available</strong></td></tr>);
              }
            } else {
              shiftList.push(<tr><td>Employee Type: {holidayData[0][x].employee_type}</td><td>Holiday: {holidayData[0][x].holiday}</td><td>Shift Time: {holidayData[0][x].shift_time}</td><td>Agent Name: <strong>Available</strong></td></tr>);
            }
          }
        }
      }
    }

    return shiftList;
  }

  return (
    <>
      <table style={{ width: '50%' }}>
        <tbody>
          {listBuilder()}
        </tbody>
      </table>
    </>
  )
}

export default GetHolidaySignUp;