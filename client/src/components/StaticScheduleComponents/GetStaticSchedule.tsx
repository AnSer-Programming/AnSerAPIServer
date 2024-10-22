import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
// import { getContactDispatchAPI } from '../utils/API';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Days from './Days';

const GetStaticSchedule = (data:any) => {
  const [contactDispatchData, setContactDispatchData] = useState<any>({});
  const [modifier, setModifier] = useState(0);

  // use this to determine if `useEffect()` hook needs to run again
  // const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  
  // useEffect(() => {
  //   const getDayData = async() => {
  //     try {
  //       const response = await getDayDataAPI();

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const data = await response.json();
  //       setContactDispatchData(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  // }, [contactDispatchDataLength]);
    
  // if (!contactDispatchDataLength) {
  //   return (
  //     <Box sx={{ display: 'flex' }}>
  //       <CircularProgress color="secondary" disableShrink />
  //     </Box>
  //   );
  // }
  
  return (
    <>
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Monday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Tuesday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Wednesday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Thursday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Friday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Saturday"
          data = {data}
          isEdit = {false} />
      </div> <br />
      <div style={{padding: '.5%', width: '65%', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          day = "Sunday"
          data = {data}
          isEdit = {false} />
      </div>
    </>
  );
};

export default GetStaticSchedule;