import React, { useState, useEffect } from 'react';
// import { getClients, getClientsByNum, getClientsByName } from '../../utils/GetDataAPI';

const HolidaysByAccount = (data:any) => {
  useEffect(()=>{
    console.log(data);
  },[data]);

  function dateTimeSplitter(dateTime: any) {
    if(dateTime) {
      let date = dateTime.split('T')[0];
  
      return `${date}`;
    } else {
      return dateTime;
    }
  }

  return (
    <>
      {
        data.holidays ?
          <table>
            <thead>
              <tr key="TableHeaderRow">
                <td style={{ paddingRight: '25px' }}>Holiday</td>
                <td style={{ paddingRight: '25px' }}>Start Date</td>
                <td style={{ paddingRight: '25px' }}>End Date</td>
              </tr>
            </thead>
            <tbody>
              {(function () {
                let rows: any = [];
                for (let i = 0; i < data.holidays.length; i++) {
                  if (data.holidays[i] == undefined) {
                    break;
                  } else {
                    rows.push(
                      <tr key={i} style={{ minWidth: '100%' }}>
                        <td style={{ paddingRight: '25px' }}>{data.holidays[i].Name}</td>
                        <td style={{ paddingRight: '25px' }}>{dateTimeSplitter(data.holidays[i].Start)}</td>
                        <td style={{ paddingRight: '25px' }}>{dateTimeSplitter(data.holidays[i].End)}</td>
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      }
    </>
  );
};

export default HolidaysByAccount;