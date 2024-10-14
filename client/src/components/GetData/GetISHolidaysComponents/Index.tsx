import React, { useState, useEffect } from 'react';
// import { getClients, getClientsByNum, getClientsByName } from '../../utils/GetDataAPI';

const Index = (data: any) => {
  useEffect(() => {
    
  }, [data]);

  function dateTimeSplitter(dateTime: any) {
    let date = dateTime.split('T')[0];

    return `${date}`;
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

export default Index;