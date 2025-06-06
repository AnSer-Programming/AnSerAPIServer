import React, { useState, useEffect } from 'react';
import { shiftAssigner, shiftOverview } from '../Utility/HolidaySignUpShiftHelper';

const ContentBuilder = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>(data.holidayData);
  const [shiftOverviewData, setShiftOverviewData] = useState<any>([]);
  const [shiftData, setShiftData] = useState<any>([]);
  const shiftDataLength = Object.keys(shiftData).length;
  const shiftOverviewDataLength = Object.keys(shiftOverviewData).length;

  useEffect(() => {
    const getData = async () => {
      if (data.holidayData.length > 0) {
        setHolidayData(data.holidayData);
        setShiftData(await shiftAssigner(data.holidayData));
        setShiftOverviewData(await shiftOverview(data.holidayData));
      }
    }

    getData();
  }, [data]);

  const shiftOverviewBuilder = () => {
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
      if (shiftOverviewDataLength > 0) {
        for (let x = 0; x < shiftOverviewDataLength; x++) {
          for (let y = 0; y < shiftOverviewData[x].totalShifts; y++) {
            if (x > 1 && y == 0) {
              if (shiftOverviewData[x].employeeType != shiftOverviewData[x - 1].employeeType) {
                tableBody.push(<hr />);
              }
            }
          }
          tableBody.push(
            <tr>
              <td>{shiftOverviewData[x].employeeType} Shift</td>
              <td>{shiftOverviewData[x].shiftTime}</td>
              <td>{shiftOverviewData[x].totalShifts}</td>
              <td>{shiftOverviewData[x].numberOfUnavailable}</td>
              <td>{shiftOverviewData[x].numberOfAvailable}</td>
            </tr>
          );
        }
        shiftList.push(<tbody>{tableBody}</tbody>);
      }
    }

    return (shiftList);
  }

  const listBuilder = () => {
    let shiftList = new Array();
    if (data.selectedHoliday == "None") {
      shiftList.push(<tr><td></td></tr>);
    } else {
      if (shiftDataLength > 0) {
        for (let x = 0; x < shiftDataLength; x++) {
          if (data.selectedEmployeeType == "All") {
            if (x > 1) {
              if (shiftData[x].employeeType != shiftData[x - 1].employeeType) {
                shiftList.push(<hr />)
              }
            }
            if (shiftData[x].agentName == "Available") {
              shiftList.push(
                <tr>
                  <td>Employee Type: {shiftData[x].employeeType}</td>
                  <td>Holiday: {shiftData[x].holiday}</td>
                  <td>Shift Time: {shiftData[x].shiftTime}</td>
                  <td>Agent Name: <strong>{shiftData[x].agentName}</strong></td>
                </tr>
              );
            } else {
              shiftList.push(
                <tr>
                  <td>Employee Type: {shiftData[x].employeeType}</td>
                  <td>Holiday: {shiftData[x].holiday}</td>
                  <td>Shift Time: {shiftData[x].shiftTime}</td>
                  <td>Agent Name: {shiftData[x].agentName}</td>
                </tr>
              );
            }
          } else {
            if (shiftData[x].employeeType == data.selectedEmployeeType) {
              if (shiftData[x].agentName == "Available") {
                shiftList.push(
                  <tr>
                    <td>Employee Type: {shiftData[x].employeeType}</td>
                    <td>Holiday: {shiftData[x].holiday}</td>
                    <td>Shift Time: {shiftData[x].shiftTime}</td>
                    <td>Agent Name: <strong>{shiftData[x].agentName}</strong></td>
                  </tr>
                );
              } else {
                shiftList.push(
                  <tr>
                    <td>Employee Type: {shiftData[x].employeeType}</td>
                    <td>Holiday: {shiftData[x].holiday}</td>
                    <td>Shift Time: {shiftData[x].shiftTime}</td>
                    <td>Agent Name: {shiftData[x].agentName}</td>
                  </tr>
                );
              }

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
        <table style={{ marginRight: '5px', width: '55%', height: '100%' }}>
          <tbody>
            {listBuilder()}
          </tbody>
        </table>
        <aside style={{ marginLeft: '5px', width: '40%' }}>
          <table style={{ width: '100%', justifyContent: 'space-evenly', borderStyle: 'solid', borderColor: '#FFFFFF', borderWidth: '2px' }}>
            {shiftOverviewBuilder()}
          </table>
        </aside>
      </div>
    </>
  )
}

export default ContentBuilder;