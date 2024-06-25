import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Days from './Days';
import { timeGetter } from '../Utility/TimeIntervals';
import { getContactsDirectoriesByDirectory } from '../../utils/GetDataAPI';

const SetStaticSchedule = (data:any) => {
  const [time, setTime] = useState<any>('Null');
  const [option, setOptions] = useState<any>('');
  const [userData, setData] = useState<any>({data: []});
  
  useEffect(() => {
    const setTimeData = async() => {
      let newTime: any = await timeGetter('1');
      newTime.data[newTime.data.length] = {value: 'Error', label: '--'};
      const response = await getContactsDirectoriesByDirectory(data.accountNum);
      const contacts = await response.json();
      let options = new Array();
      for(let i = 0; i < contacts.length; i++) {
        options[i] = await contacts[i].Field.trim();
      }
      setTime(newTime);
      await setOptions(await options.sort());
    }
    setTimeData();
  }, [data]);

  // use this to determine if `useEffect()` hook needs to run again
  // let timeDataLength;
  // if(time.data) {
  //   timeDataLength = time.data.length;
  // }
    
  // if (!timeDataLength) {
  //   return (
  //     <Box sx={{ display: 'flex' }}>
  //       <CircularProgress color="secondary" disableShrink />
  //     </Box>
  //   );
  // }
  
  return (
    <>
      <div style={{padding: '.5%', width: '750px', border: '1px solid', borderRadius: '25px'}}>
        <Days 
          data = {userData.data}
          day = "Monday"
          accountNum = {data.accountNum}
          options = {option}
          isEdit = {true} />
      </div>
    </>
  );
};

export default SetStaticSchedule;