import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
// import { getContactDispatchAPI } from '../utils/API';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Days from './Days';
import { timeGetter } from '../Utility/TimeIntervals';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Contact from './Contact';
import { getContactsDirectoriesByDirectory } from '../../utils/GetDataAPI';

const GetContactDispatch = (data:any) => {
  const [time, setTime] = useState<any>('Null');
  const [start, setStartTime] = useState<any>('Error');
  const [end, setEndTime] = useState<any>('Error');
  const [contact, setContact] = useState<any>('--');
  const [option, setOptions] = useState<any>('');
  
  useEffect(() => {
    const setTimeData = async() => {
      let newTime: any = await timeGetter('1');
      newTime.data[newTime.data.length] = {value: 'Error', label: '--'};
      const response = await getContactsDirectoriesByDirectory(data.accountNum);
      const contacts = await response.json();
      let options = new Array()
      for(let i = 0; i < contacts.length; i++) {
        options[i] = contacts[i].Field.trim();
      }
      setTime(newTime);
      setOptions(options.sort());
    }
    setTimeData();
  }, [data]);

  // use this to determine if `useEffect()` hook needs to run again
  let timeDataLength;
  if(time.data) {
    timeDataLength = time.data.length;
  }
    
  if (!timeDataLength) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="secondary" disableShrink />
      </Box>
    );
  }

  const handleSetStart = (event: SelectChangeEvent) => {
    if(end) {
      if(parseInt(end) < parseInt(event.target.value)) {
        setStartTime(event.target.value);
        setEndTime("Error");
      } else {
        setStartTime(event.target.value);
      }
    } else {
      setStartTime(event.target.value);
    }
  }

  const handleSetEnd = (event: SelectChangeEvent) => {
    if(start) {
      if(parseInt(start) > parseInt(event.target.value)) {
        setEndTime("Error");
      } else {
        setEndTime(event.target.value);
      }
    } else {
      setEndTime(event.target.value);
    }
  }

  const handleContactEdit = async(value: any) => {
    setContact(value);
  }

  const timeSelection = () => {
    let menuItems = new Array();
    for(let i = 0; i < time.data.length; i++) {
      menuItems[i] = <MenuItem value={time.data[i].value}>{time.data[i].label}</MenuItem>
    }
    return menuItems;
  }
  
  return (
    <>
      <div style={{padding: '.5%', width: '750px', border: '1px solid', borderRadius: '25px'}}>
        <h1>Monday</h1>
        <div style={{display: 'flex', color: 'black', flexDirection: 'row'}}>
          <Box>
            <FormControl variant="filled">
              <InputLabel id="startTimeLabel" style={{ color: 'black' }}>Start Time</InputLabel>
              <Select
                labelId="startTimeLabel"
                id="startTime"
                value={start}
                label="Start"
                sx={{ width: 125, zIndex: 0, bgcolor: 'white'}}
                onChange={handleSetStart} 
                > 
                {timeSelection()}
              </Select>
            </FormControl>
          </Box>
          <span style={{width: '1%'}}></span>
          <Box>
            <FormControl variant="filled">
              <InputLabel id="endTimeLabel" style={{ color: 'black' }}>End Time</InputLabel>
              <Select
                labelId="endTimeLabel"
                id="endTime"
                value={end}
                label="End Time"
                sx={{ width: 125, zIndex: 0, bgcolor: 'white'}}
                onChange={handleSetEnd} 
                > 
                {timeSelection()}
              </Select>
            </FormControl>
          </Box>
          <span style={{width: '1%'}}></span>
          <Contact
            contact = {contact}
            contactEdit = {(value:string) => handleContactEdit(value)}
            options = {option} />
          <span style={{width: '1%'}}></span>
          <button style={{borderRadius: '25px', width: '100px'}}>Add</button>
        </div><br />
        <Days 
          data = {data} />
      </div>
    </>
  );
};

export default GetContactDispatch;