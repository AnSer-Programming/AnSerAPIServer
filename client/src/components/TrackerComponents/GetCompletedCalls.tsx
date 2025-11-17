import React, { useState, useEffect } from 'react';
import { getCallsCompleted } from '../../utils/TrackerDataAPI';
import LinearProgress from '@mui/material/LinearProgress';
// import dayjs from 'dayjs';
import GetCompletedCallsByTimeZone from './GetCompletedCallsByTimeZone';
import GetCompletedCallsByHour from './GetCompletedCallsByHour';

const GetCompletedCalls = () => {
  const [callsCompletedData, setCallsCompletedData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const callsCompletedDataLength = Object.keys(callsCompletedData).length;
  
  useEffect(() => {
    const getCallsCompletedData = async() => {
      try {
        const response = await getCallsCompleted();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }
        const completedCalls = await response.json();

        setCallsCompletedData(completedCalls);
      } catch (err) {
        console.error(err);
      }
    };
    
    const interval = setInterval(() => {
      getCallsCompletedData();
    }, 60000);
    getCallsCompletedData();

    return () => clearInterval(interval);
  }, [callsCompletedDataLength]);
  
  if (!callsCompletedDataLength) {
    return <><br /><LinearProgress color="secondary" /></>;
  } else {
    return (
      <>
        <GetCompletedCallsByTimeZone 
          completedCallsData = {callsCompletedData} />
        <GetCompletedCallsByHour 
          completedCallsData = {callsCompletedData} />
      </>
    );
  }
};

export default GetCompletedCalls;