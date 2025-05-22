import React, { useState, useEffect } from 'react';
import PieChart from '../GraphBuilderComponents/PieChartGraph'

const GetCompletedCallsByTimeZone = (data:any) => {
  const [callsCompletedData, setCallsCompletedData] = useState<any>(data.completedCallsData);

  // use this to determine if `useEffect()` hook needs to run again
  const callsCompletedDataLength = Object.keys(callsCompletedData).length;

  const callsCompletedByTimeZoneObj:any = {
    Eastern: 0,
    Central: 0,
    Mountain: 0,
    Pacific: 0,
    Other: 0
  }

  async function callsByTimeZone() {
    for(let i = 0; i < callsCompletedDataLength; i++) {
      if(callsCompletedData[i].cltId != 3576 
          && callsCompletedData[i].cltId != 1648 
          && callsCompletedData[i].cltId != 27
          && callsCompletedData[i].cltId != 73
          && callsCompletedData[i].cltId != 5230
          && callsCompletedData[i].cltId != 3721
          && callsCompletedData[i].cltId != 3413
          && callsCompletedData[i].cltId != 2311
          && callsCompletedData[i].cltId != 4244
          && callsCompletedData[i].cltId != 2259
          && callsCompletedData[i].cltId != 1052) {
        if(callsCompletedData[i].TimezoneOffset == 0) {
          callsCompletedByTimeZoneObj.Central++;
        } else if(callsCompletedData[i].TimezoneOffset == 60) {
          callsCompletedByTimeZoneObj.Eastern++;
        } else if(callsCompletedData[i].TimezoneOffset == -60) {
          callsCompletedByTimeZoneObj.Mountain++;
        } else if(callsCompletedData[i].TimezoneOffset == -120) {
          callsCompletedByTimeZoneObj.Pacific++;
        } else {
          callsCompletedByTimeZoneObj.Other++;
        }
      }
    }
  }
  
  callsByTimeZone();

  return (
    <>
      <div>
        <p>
          Calls Completed by TimeZone within the past 24 hours<br />
          Total Calls taken in past 24 hours: {callsCompletedByTimeZoneObj.Pacific+callsCompletedByTimeZoneObj.Mountain+callsCompletedByTimeZoneObj.Eastern+callsCompletedByTimeZoneObj.Central}  
        </p>
        <ul>
          <li>Total Calls for Eastern Time Zone Clients: {callsCompletedByTimeZoneObj.Eastern}</li>
          <li>Percent Calls from Eastern Time Zone Clients: {(callsCompletedByTimeZoneObj.Eastern/(callsCompletedByTimeZoneObj.Pacific+callsCompletedByTimeZoneObj.Mountain+callsCompletedByTimeZoneObj.Eastern+callsCompletedByTimeZoneObj.Central)*100).toFixed(2)}%</li><br />
          <li>Total Calls for Central Time Zone Clients: {callsCompletedByTimeZoneObj.Central}</li>
          <li>Percent Calls from Central Time Zone Clients: {(callsCompletedByTimeZoneObj.Central/(callsCompletedByTimeZoneObj.Pacific+callsCompletedByTimeZoneObj.Mountain+callsCompletedByTimeZoneObj.Eastern+callsCompletedByTimeZoneObj.Central)*100).toFixed(2)}%</li><br />
          <li>Total Calls for Mountain Time Zone Clients: {callsCompletedByTimeZoneObj.Mountain}</li>
          <li>Percent Calls from Mountain Time Zone Clients: {(callsCompletedByTimeZoneObj.Mountain/(callsCompletedByTimeZoneObj.Pacific+callsCompletedByTimeZoneObj.Mountain+callsCompletedByTimeZoneObj.Eastern+callsCompletedByTimeZoneObj.Central)*100).toFixed(2)}%</li><br />
          <li>Total Calls for Pacific Time Zone Clients: {callsCompletedByTimeZoneObj.Pacific}</li>
          <li>Percent Calls from Pacific Time Zone Clients: {(callsCompletedByTimeZoneObj.Pacific/(callsCompletedByTimeZoneObj.Pacific+callsCompletedByTimeZoneObj.Mountain+callsCompletedByTimeZoneObj.Eastern+callsCompletedByTimeZoneObj.Central)*100).toFixed(2)}%</li><br />
        </ul>
        <PieChart
          graphData = {callsCompletedByTimeZoneObj} />
      </div>
    </>
  );
};

export default GetCompletedCallsByTimeZone;