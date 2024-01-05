import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getSchedulerAPI, setSchedulerAPI } from '../../utils/API';

let accountNumPlaceHolder = null;
interface Option {
  value: string;
  label: string;
}

const GetScheduler = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [date, setDate] = useState<string>('Null');
  const [accountNum, setAccountNum] = useState<number>(0);
  let placeHolderData:any = schedulerData;
  let change:boolean = false;
  let option: Option[] = [];
  
  const schedulerDataLength = Object.keys(schedulerData).length;
  
  useEffect(() => {
    const getSchedulerData = async() => {
      try {
        setAccountNum(data.accountData);
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
  }, [data.accountData, schedulerData]);
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }
  Object.keys(schedulerData).map((keys:string) => option.push({value: `${keys}`, label: `${keys}`}));

  const handlerChangeAccount = (event:any) => {
    setDate(event.value);
  }

  const bookAnAppointmentHandler = (time:string) => {
    for(let i = 0; i < schedulerData[date].length; i++) {
      if(placeHolderData[date][i].Time === time) {
        placeHolderData[date][i].Availability = "Unavailable";
        change = true;
      }
    }
    setSchedulerData(setSchedulerAPI(accountNum, placeHolderData));
  }

  return (
    <>
      <div style={{width: '50%', marginLeft: '5px'}}>
        <Select
          className='text-dark' 
          name="Account List"
          getOptionLabel={(option: Option) => option.label}
          getOptionValue={(option: Option) => option.value}
          onChange={handlerChangeAccount}
          options={option}
          defaultValue={date ? {value: 'Null', label: 'Select A Date'} : {value: `${date}`, label: `${date}`}}
        /> <br />
      </div>
      <table>
          {(function(){
            let rows:any = [];
            let hasData:boolean = false;
            if(typeof(schedulerData[date]) != "undefined") {
              for(let y=0; y < schedulerData[date].length; y++) {
                if(schedulerData[date][y].Availability === "Available") {
                  rows.push(
                    <tr style={{border: '2px solid'}}>
                      <td style={{padding: '5px'}}>{schedulerData[date][y].Time}</td>
                      <td><button style={{marginLeft: '50px'}} onClick={() => bookAnAppointmentHandler(schedulerData[date][y].Time)}>Book This Time</button></td>
                    </tr>);
                  hasData = true;
                }
              }
              if(!hasData) {
                if(date === 'Null') {
                  rows.push(<tr><td>Select a Date from the drop down above!</td></tr>);
                } else {
                  rows.push(<tr><td>There are no times available for {date}</td></tr>);
                }
              }
            } else {
              if(date === 'Null') {
                rows.push(<tr><td>Select a Date from the drop down above!</td></tr>);
              } else {
                rows.push(<tr><td>There are no times available for {date}</td></tr>);
              }
            }
            
            return <tbody>{rows}</tbody>;
          }())}
      </table>
    </>
  );
};

export default GetScheduler;