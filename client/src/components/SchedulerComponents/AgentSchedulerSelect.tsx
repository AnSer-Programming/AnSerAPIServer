import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getSchedulerAPI, setSchedulerAPI } from '../../utils/API';

interface Option {
  value: string;
  label: string;
}

const AgentSchedulerSelect = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [date, setDate] = useState<string>(data.date);
  const [hasChange, setHasChange] = useState<boolean>(false);
  let placeHolderData:any = schedulerData;
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

    const setNewDate = async() => {
      await setDate(data.date);
    }

    if(data.date != date) {
      setNewDate();
    }

    getSchedulerData();
  }, [data.accountData, schedulerData, data.date, hasChange]);
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }
  Object.keys(schedulerData).map((keys:string) => option.push({value: `${keys}`, label: `${keys}`}));

  const bookAnAppointmentHandler = (time:string) => {
    for(let i = 0; i < schedulerData[data.date].length; i++) {
      if(placeHolderData[data.date][i].Time === time) {
        data.setTimeFunction(time);
        data.setSchedulerDataFunction(schedulerData);
        setHasChange(true);
        data.setReviewFunction(true);
        placeHolderData[data.date][i].Availability = "Unavailable";
      }
    }
    setSchedulerData(setSchedulerAPI(data.accountData, placeHolderData));
  }

  return (
    <>
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

export default AgentSchedulerSelect;