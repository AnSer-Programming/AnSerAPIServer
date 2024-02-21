import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getSchedulerAPI, setSchedulerAPI } from '../../utils/API';
import AgentReview from './AgentReview';
import AgentSchedulerSelect from './AgentSchedulerSelect';

interface Option {
  value: string;
  label: string;
}

const GetScheduler = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [date, setDate] = useState<string>('Null');
  const [time, setTime] = useState<string>('Null');
  const [isReview, setIsReview] = useState<boolean>(false);
  let option: Option[] = [];
  
  const schedulerDataLength = Object.keys(schedulerData).length;
  
  useEffect(() => {
    const getSchedulerData = async() => {
      try {
        const response = await getSchedulerAPI(data.accountData);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const scheduler = await response.json();
        
        setSchedulerData(scheduler);
      } catch (err) {
        console.error(err);
      }
    };

    getSchedulerData();
  }, [data.accountData, date]);
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }

  const handlerChangeDate = (event:any) => {
    setDate(event.value);
  }

  Object.keys(schedulerData).map((keys:string) => option.push({value: `${keys}`, label: `${keys}`}));

  const display = () => {
    if(isReview) {
      return (
        <AgentReview 
          accountNum = {data.accountData}
          time = {time}
          date = {date}
          jsonData = {schedulerData}
          setReviewFunction = {(review:boolean)=>setIsReview(review)} />
      )
    } else {
      return (
        <>
          <div style={{width: '50%', marginLeft: '5px'}}>
            <Select
              className='text-dark' 
              name="Account List"
              getOptionLabel={(option: Option) => option.label}
              getOptionValue={(option: Option) => option.value}
              onChange={handlerChangeDate}
              options={option}
              defaultValue={date ? {value: 'Null', label: 'Select A Date'} : {value: `${date}`, label: `${date}`}}
            /> <br />
          </div>
          <AgentSchedulerSelect 
            accountData = {data.accountData}
            date = {date}
            setTimeFunction = {(newTime:string)=>setTime(newTime)}
            setReviewFunction = {(review:boolean)=>setIsReview(review)}
            setSchedulerDataFunction = {(rawJSON:any)=>setSchedulerData(rawJSON)} />  
        </>
      )
    }
  }

  return (
    <>
      {display()}
    </>
  );
};

export default GetScheduler;