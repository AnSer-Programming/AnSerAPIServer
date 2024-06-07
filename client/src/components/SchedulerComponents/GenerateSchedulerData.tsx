import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getSchedulerAPI, setSchedulerAPI } from '../../utils/API';
import AgentReview from './AgentReview';
import AgentSchedulerSelect from './AgentSchedulerSelect';
import { timeSetter } from '../Utility/TimeIntervals';

interface Option {
  value: string;
  label: string;
}

const GenerateSchedulerData = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [date, setDate] = useState<string>('Null');
  const [time, setTime] = useState<string|string[]>('Null');
  const [isReview, setIsReview] = useState<boolean>(false);
  let option: Option[] = [];
  
  // const schedulerDataLength = Object.keys(schedulerData).length;
  
  useEffect(() => {
    const setTimeData = async() => {
      let newTime = await timeSetter(data.appointmentLength, data.startTime, data.endTime);
      setTime(newTime);
    }
    // const getSchedulerData = async() => {
    //   try {
    //     const response = await getSchedulerAPI(data.accountData);

    //     if (!response.ok) {
    //       throw new Error('something went wrong!');
    //     }

    //     const scheduler = await response.json();
        
    //     setSchedulerData(scheduler);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    // getSchedulerData();
    setTimeData();
  }, [data]);
  
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
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '45%', flexWrap: 'wrap'}}>
      {displayHandler()}
    </div>
    </>
  );
};

export default GenerateSchedulerData;