import React, { useState, useEffect } from 'react';
import { setSchedulerAPI } from '../../utils/API';

const AgentReview = (data:any) => {
  const [jsonData, setJSONData] = useState<any>(data.jsonData);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(()=>{
    const setState = async() => {
      setJSONData(data.jsonData);
    }
    setState();
  },[isComplete])

  const cancelHandler = () => {
    for(let i = 0; i < data.jsonData[data.date].length; i++) {
      if(data.jsonData[data.date][i].Time === data.time) {
        data.setReviewFunction(true);
        setJSONData(data.jsonData[data.date][i].Availability = "Available");
      }
    }
    setSchedulerAPI(data.accountNum, data.jsonData);
    data.setReviewFunction(false);
  }

  const confirmHandler = () => {
    for(let i = 0; i < data.jsonData[data.date].length; i++) {
      if(data.jsonData[data.date][i].Time === data.time) {
        data.setReviewFunction(true);
        setJSONData(data.jsonData[data.date][i].Availability = "Unavailable");
      }
    }
    setSchedulerAPI(data.accountNum, data.jsonData);
    setIsComplete(true); 
  }

  return (
    <>
      <div>
        <p>You have selected {data.time} for {data.date}.</p>
        <p>Please confirm this with the caller. If the date and time are what they wanted to book for their appointment then select the confirm button otherwise hit cancel and select a new date and time for the caller.</p>
        {
          isComplete ? 
            <p>The appointment has been claimed. You can close this page after you have completed entering the date and time into the script.</p> :
            <><button onClick={()=>confirmHandler()}>Confirm</button> <button onClick={()=>cancelHandler()}>Cancel</button></>
        }
      </div>
    </>
  );
};

export default AgentReview;