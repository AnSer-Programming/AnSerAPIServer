import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getSchedulerAPI, setSchedulerAPI } from '../../utils/API';
import { timeGetter } from '../Utility/TimeIntervals';

const Days = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [date, setDate] = useState<string>('Null');
  const [time, setTime] = useState<string|string[]>('Null');
  const [isReview, setIsReview] = useState<boolean>(false);
  
  // const schedulerDataLength = Object.keys(schedulerData).length;
  
  // useEffect(() => {
  //   const setTimeData = async() => {
  //     let newTime = await timeGetter('1');
  //     setTime(newTime);
  //   }
  //   setTimeData();
  // }, [data]);
  
  // if (!schedulerDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  const displayHandler = () => {
    let spacedData = new Array();
    let timeRange = new Array();

    for(let i = 0; i < time.length; i++) {
      spacedData[i] = time[i] + " ";
      timeRange[i] = <button id={`${i}`} style={{width: '100px', margin: '5px'}}>{time[i]}</button>
    }

    return timeRange;
  }

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
        {displayHandler()}
      </div>
    </>
  );
};

export default Days;