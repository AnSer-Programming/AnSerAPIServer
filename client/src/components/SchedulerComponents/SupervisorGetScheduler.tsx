import React, { useState, useEffect } from 'react';

const GetScheduler = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  
  const schedulerDataLength = Object.keys(schedulerData).length;
  useEffect(() => {
    setSchedulerData(data.accountData); 
    console.log(schedulerData);
  }, [data.accountData])
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
          {(function(){
            let headers:any = [];
            let rows:any = [];
            let date:any;
            for(let x = 0; x < schedulerData.Available.Dates.length; x++) {
              headers.push(<th>{schedulerData.Available.Dates[x].Date}</th>);
              date = schedulerData.Available.Dates[x].Date.toString();
              console.log(date);
              console.log(schedulerData.Available[date]);
              if(typeof(schedulerData.Available[date]) != "undefined") {
                for(let y=0; y < schedulerData.Available[date].length; y++) {
                  rows.push(<td>{schedulerData.Available[date][y].Time}</td>);
                }
              }
            }
            return <tbody><tr>{headers}</tr><tr>{rows}</tr></tbody>;
          }())}
      </table>
    </>
  );
};

export default GetScheduler;