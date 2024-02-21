import React, { useState, useEffect } from 'react';
import SingleLineGraph from '../GraphBuilderComponents/SingleLineGraph';

const GetCompletedCallsByHour = (data:any) => {
  const [callsCompletedData, setCallsCompletedData] = useState<any>(data.completedCallsData);

  const callsCompletedDataLength = Object.keys(callsCompletedData).length;

  let callsCompletedByHour:any = [{
		hour: null,
		total: 0
  }];

  function callsByTimeZone() {
    for(let i = 0; i < callsCompletedDataLength; i++) {
			let placeHolder = 0;
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
				
				if(callsCompletedData[i].dateTime.slice(12).split(':')[0] == 12) {
					if(callsCompletedData[i].dateTime.slice(-2) == "AM") {
						placeHolder = parseInt(callsCompletedData[i].dateTime.slice(12).split(':')[0])+12;
					} else {
						placeHolder = parseInt(callsCompletedData[i].dateTime.slice(12).split(':')[0]);
					}
				} else {
					if(callsCompletedData[i].dateTime.slice(-2) == "PM") {
						placeHolder = parseInt(callsCompletedData[i].dateTime.slice(12).split(':')[0])+12;
					} else {
						placeHolder = parseInt(callsCompletedData[i].dateTime.slice(12).split(':')[0]);
					}
				}

				let found:boolean = false;
				for(let x = 0; x < callsCompletedByHour.length; x++) {
					if(callsCompletedByHour[0].hour == null) {
						callsCompletedByHour[0].hour = placeHolder;
						callsCompletedByHour[0].total++;
						found = true;
					} else if(callsCompletedByHour[x].hour == placeHolder) {
						callsCompletedByHour[x].hour = placeHolder;
						callsCompletedByHour[x].total++;
						found = true;
					}
				}
				if(!found) {
					callsCompletedByHour[callsCompletedByHour.length] = {hour: placeHolder, total: 1};
				}
      }
    }
  }
  
  callsByTimeZone();

  return (
    <>
      <div>
        <p>Hourly Completed Calls</p>
				<SingleLineGraph 
					graphData = {callsCompletedByHour} />
      </div>
    </>
  );
};

export default GetCompletedCallsByHour;