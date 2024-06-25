import React, { useState, useEffect } from 'react';
import { timeGetter } from '../Utility/TimeIntervals';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Contact from './Contact';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Days = (data: any) => {
  const [dayData, setDayData] = useState<any>({});
  const [time, setTime] = useState<any>('Null');
  const [start, setStartTime] = useState<any>('Error');
  const [end, setEndTime] = useState<any>('Error');
  const [contact, setContact] = useState<any>('--');
  const [option, setOptions] = useState<any>('');
  const [isEditable, setEditable] = useState<boolean>(false);
  let optionsLength;

  if(data.options) {
    optionsLength = data.options.length;
  }

  useEffect(() => {
    console.log(data);
    setDayData(data.data);
    const setTimeData = async () => {
      let newTime: any = await timeGetter('1');
      newTime.data[newTime.data.length] = { value: 'Error', label: '--' };
      setTime(newTime);
      await setOptions(await data.options);
      setEditable(data.isEdit);
    }
    setTimeData();
  }, [data.isEdit, optionsLength]);

  let timeDataLength;
  if (time.data) {
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
    if (end) {
      if (parseInt(end) < parseInt(event.target.value)) {
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
    if (start) {
      if (parseInt(start) > parseInt(event.target.value)) {
        setEndTime("Error");
      } else {
        setEndTime(event.target.value);
      }
    } else {
      setEndTime(event.target.value);
    }
  }

  const handleContactEdit = async (value: any) => {
    setContact(value);
  }

  const handleDeleteData = async (index: number, day: string) => {
    let dataPlaceHolder: any = dayData.data;
    dataPlaceHolder[index] = await { contact: contact, start: start, end: end };
    setDayData({ data: dataPlaceHolder });
  }

  const handlerAddEvent = async () => {
    console.log(dayData);
    let dataPlaceHolder: any = dayData.data;
    dataPlaceHolder[dataPlaceHolder.length] = await { contact: contact, start: start, end: end };
    setDayData({ data: dataPlaceHolder });
    console.log(dayData);
  }

  const timeSelection = () => {
    let menuItems = new Array();
    for (let i = 0; i < time.data.length; i++) {
      menuItems[i] = <MenuItem value={time.data[i].value}>{time.data[i].label}</MenuItem>
    }
    return menuItems;
  }

  const displayHandler = () => {
    let spacedData = new Array();
    for (let i = 0; i < dayData.length; i++) {
      spacedData[i] = <tr><td>{dayData[i].start}</td><td>{dayData[i].end}</td><td>{dayData[i].contact}</td><td><button onClick={() => data.deleteDataHandler(i, data.day)}>Remove</button></td></tr>
    }

    return spacedData;
  }

  return (
    <>
      <h1>{data.day}</h1>
      { isEditable ? 
      <div style={{ display: 'flex', color: 'black', flexDirection: 'row' }}>
        <Box>
          <FormControl variant="filled">
            <InputLabel id="startTimeLabel" style={{ color: 'black' }}>Start Time</InputLabel>
            <Select
              labelId="startTimeLabel"
              id="startTime"
              value={start}
              label="Start"
              sx={{ width: 125, zIndex: 0, bgcolor: 'white' }}
              onChange={handleSetStart}
            >
              {timeSelection()}
            </Select>
          </FormControl>
        </Box>
        <span style={{ width: '1%' }}></span>
        <Box>
          <FormControl variant="filled">
            <InputLabel id="endTimeLabel" style={{ color: 'black' }}>End Time</InputLabel>
            <Select
              labelId="endTimeLabel"
              id="endTime"
              value={end}
              label="End Time"
              sx={{ width: 125, zIndex: 0, bgcolor: 'white' }}
              onChange={handleSetEnd}
            >
              {timeSelection()}
            </Select>
          </FormControl>
        </Box>
        <span style={{ width: '1%' }}></span>
        <Contact
          contact={contact}
          contactEdit={(value: string) => handleContactEdit(value)}
          options={option} />
        <span style={{ width: '1%' }}></span>
        <button style={{ borderRadius: '25px', width: '100px' }} onClick={handlerAddEvent}>Add</button>
      </div> : <br /> }
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <table><tbody>{displayHandler()}</tbody></table>
      </div> 
    </>
  );
};

export default Days;