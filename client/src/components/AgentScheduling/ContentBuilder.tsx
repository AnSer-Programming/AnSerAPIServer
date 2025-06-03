import React, { useState, useEffect } from 'react';
import { shiftAssigner } from '../Utility/HolidaySignUpShiftHelper';

const ContentBuilder = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>(data.holidayData);
  const [dataBuilder, setDataBuilder] = useState<any>([]);
  const holidayDataLength = Object.keys(holidayData).length;

  useEffect(() => {
    const getData = async() => {
      if(data.holidayData.length > 0) {
        setHolidayData(data.holidayData);
        setDataBuilder(await shiftAssigner(data.holidayData));
      }
    }

    getData();
  }, [data]);

  // console.log(holidayData);
  // console.log(dataBuilder);

  const shiftOverview = () => {
    let signedUpCounter: number = 0;
    let totalSignedUp: number = 0;
    let shiftList = new Array();
    let tableBody = new Array();
    if (data.selectedHoliday == "None") {
      shiftList.push(<></>);
    } else {
      shiftList.push(
        <thead style={{ borderBottom: 'solid 1px #FFFFFF' }}>
          <tr>
            <td>Shift Type</td>
            <td>Shift Time</td>
            <td>Total Shifts</td>
            <td>Taken Shifts</td>
            <td>Available Shifts</td>
          </tr>
        </thead>
      );
      if (holidayData.length > 0) {
        for (let x = 0; x < holidayData[0].length; x++) {
          totalSignedUp = 0;
          for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
            if (x > 1 && y == 0) {
              if (holidayData[0][x].employee_type != holidayData[0][x - 1].employee_type) {
                tableBody.push(<hr />);
              }
            }
            if (holidayData[1].length > 0) {
              if (holidayData[1][signedUpCounter]) {
                if (holidayData[0][x].id === holidayData[1][signedUpCounter].holiday_id && signedUpCounter < holidayData[1].length) {
                  signedUpCounter++;
                  totalSignedUp++;
                }
              }
            }
          }
          tableBody.push(
            <tr>
              <td>{holidayData[0][x].employee_type} Shift</td>
              <td>{holidayData[0][x].shift_time}</td>
              <td>{holidayData[0][x].number_of_shifts}</td>
              <td>{totalSignedUp}</td>
              <td>{holidayData[0][x].number_of_shifts - totalSignedUp}</td>
            </tr>
          );
        }
        shiftList.push(<tbody>{tableBody}</tbody>)
      }
    }

    return (shiftList);
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <aside style={{ marginLeft: '5px', width: '40%' }}>
          <table style={{ width: '100%', justifyContent: 'space-evenly', borderStyle: 'solid', borderColor: '#FFFFFF', borderWidth: '2px' }}>
            {shiftOverview()}
          </table>
        </aside>
        <table style={{ marginRight: '5px', width: '55%' }}>
          <tbody>
            {listBuilder()}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ContentBuilder;