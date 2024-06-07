import React, { useState, useEffect } from 'react';
import { setResidentDirectoryAPI } from '../utils/API';
import TextField from '@mui/material/TextField';
import Select from 'react-select';
import GenerateSchedulerData from '../components/SchedulerComponents/GenerateSchedulerData';

const SetSchedulerData = (data) => {
  const [schedulerData, setSchedulerData] = useState(data.accountData);
  const [appointmentLength, setAppointmentLength] = useState(0);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [date, setDate] = useState();

  // use this to determine if `useEffect()` hook needs to run again
  // const schedulerDataLength = Object.keys(schedulerData).length;

  // let updateSchedulerData:any = schedulerData;

  const handleIntervalChange = (event) => {
    setAppointmentLength(event.value);
  }

  const handleSetStartTime = (event) => {
    setStartTime(event);
  }

  const handleSetEndTime = (event) => {
    setEndTime(event);
  }

  const handleSetDate = (event) => {
    setDate(event);
  }

  const option = [
    { value: '15', label: '0:15' },
    { value: '20', label: '0:20' },
    { value: '30', label: '0:30' },
    { value: '45', label: '0:45' },
    { value: '1', label: '1:00' },
    { value: '130', label: '1:30' }
  ];

  return (
    <>
      <TextField
        label="Date for appointments"
        onChange={(event) => {
          handleSetDate(event.target.value);
        }}
        id={`date`}
        className={'bg-white'}
        sx={{ width: 250, zIndex: 0 }}
        variant="filled"
        /> <br /> <br />
      <div style={{display: 'flex', width: '40%', flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextField
          label="Enter a start time"
          onChange={(event) => {
            handleSetStartTime(event.target.value);
          }}
          id={`startTime`}
          className={'bg-white'}
          sx={{ width: 250, zIndex: 0 }}
          variant="filled"
          />
        <TextField
          label="Enter an end time"
          onChange={(event) => {
            handleSetEndTime(event.target.value);
          }}
          id={`endTime`}
          className={'bg-white'}
          sx={{ width: 250, zIndex: 0 }}
          variant="filled"
          />
        <div style={{width: '150px'}}>
          <Select
            className='text-dark'
            name="Appointment Length"
            value={option.value}
            onChange={handleIntervalChange}
            options={option}
            // defaultValue={{value: '0', label: 'Walk-Through'}}
            /> 
        </div>
      </div> <br />
      <GenerateSchedulerData
        appointmentLength={appointmentLength}
        startTime={startTime}
        endTime={endTime}
      />
    </>
  )
};

export default SetSchedulerData;