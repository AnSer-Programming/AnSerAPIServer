import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp } from '../../utils/AgentSuccessAPI';

const OverviewOnly = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>({});
  const [takenShiftData, setTakenShiftData] = useState<any>({});
  const takenShiftDataLength = Object.keys(takenShiftData).length;
  const holidayDataLength = Object.keys(holidayData).length;

  let overviewData: any = {};

  useEffect(() => {
    const getData = async () => {
      let response = new Array();
      let returnData;
      response[0] = await getHolidayData("All");
      response[1] = await getHolidaySignUp(data.holidayType);

      returnData = await response[0].json();
      setHolidayData(returnData);

      returnData = await response[1].json();
      setTakenShiftData(returnData);
    }

    getData();
  }, [data.holidayType, takenShiftDataLength, holidayDataLength]);

  function buildOverviewObj() {
    let takenCounter: number;
    for (let x = 0; x < holidayData.length; x++) {
      takenCounter = 0;
      for (let y = 0; y < takenShiftData.length; y++) {
        if (holidayData[x].id == takenShiftData[y].holiday_id) {
          takenCounter++
        }
      }
      if (overviewData[`${holidayData[x].holiday}`]) {
        overviewData[`${holidayData[x].holiday}`].push({
          employeeType: `${holidayData[x].employee_type}`,
          shiftTime: `${holidayData[x].shift_time}`,
          totalShifts: `${holidayData[x].number_of_shifts}`,
          takenShifts: takenCounter,
          availableShifts: holidayData[x].number_of_shifts - takenCounter
        });
      } else {
        overviewData[holidayData[x].holiday] = new Array();
        overviewData[`${holidayData[x].holiday}`].push({
          employeeType: `${holidayData[x].employee_type}`,
          shiftTime: `${holidayData[x].shift_time}`,
          totalShifts: holidayData[x].number_of_shifts,
          takenShifts: takenCounter,
          availableShifts: holidayData[x].number_of_shifts - takenCounter
        });
      }
    }
    return overviewData;
  }

  const shiftOverviewBuilder = () => {
    const shiftOverviewData: any = buildOverviewObj();
    const shiftOverviewKeys = Object.keys(shiftOverviewData);
    console.log(shiftOverviewData);
    let shiftList = new Array();
    let tableBody = new Array();
    if (data.selectedHoliday == "None") {
      shiftList.push(<></>);
    } else {
      for (let x = 0; x < shiftOverviewKeys.length; x++) {
        for (let y = 0; y < shiftOverviewData[shiftOverviewKeys[x]].length; y++) {
          if (y > 0) {
            if (shiftOverviewData[shiftOverviewKeys[x]][y].employeeType != shiftOverviewData[shiftOverviewKeys[x]][y - 1].employeeType) {
              tableBody.push(<tr><td colSpan={5} className="holidaySignUpItem"><hr /></td></tr>);
            }
          }
          tableBody.push(
            <tr>
              <td className="holidaySignUpItem">{shiftOverviewData[shiftOverviewKeys[x]][y].employeeType}</td>
              <td className="holidaySignUpItem">{shiftOverviewData[shiftOverviewKeys[x]][y].shiftTime}</td>
              <td className="holidaySignUpItem">{shiftOverviewData[shiftOverviewKeys[x]][y].availableShifts}</td>
              <td className="holidaySignUpItem">{shiftOverviewData[shiftOverviewKeys[x]][y].takenShifts}</td>
              <td className="holidaySignUpItem">{shiftOverviewData[shiftOverviewKeys[x]][y].totalShifts}</td>
            </tr>
          );
          if (y == shiftOverviewData[shiftOverviewKeys[x]].length - 1) {
            shiftList.push(
              <div style={{ width: '32%' }}>
                <table className="holidaySignUpReview">
                  <thead>
                    <tr>
                      <th colSpan={5} style={{ textAlign: 'center' }} className="holidaySignUpItem">{shiftOverviewKeys[x]}</th>
                    </tr>
                    <tr style={{ borderBottom: 'solid 1px #FFFFFF' }}>
                      <td className="holidaySignUpItem">Shift Type</td>
                      <td className="holidaySignUpItem">Shift Time</td>
                      <td className="holidaySignUpItem">Available Shifts</td>
                      <td className="holidaySignUpItem">Taken Shifts</td>
                      <td className="holidaySignUpItem">Total Shifts</td>
                    </tr>
                  </thead>
                  <tbody>{tableBody}</tbody>
                </table>
              </div>
            );
            tableBody = new Array();
          }
        }
      }
    }

    return (shiftList);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {holidayData && takenShiftData ? shiftOverviewBuilder() : <br />}
      </div>
    </>
  );
}

export default OverviewOnly;