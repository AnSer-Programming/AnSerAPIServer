import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
import { setCalendarEvent, getAllCalendarEvents } from '../../utils/CalendarAPI';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const SetCalendar = (data:any) => {
    const [calendarData, setAllCalendarEventsData] = useState<any>({});
  
    // use this to determine if `useEffect()` hook needs to run again
    const calendarEventsDataLength = Object.keys(calendarData).length;
    
    useEffect(() => {
      const getAllCalendarEventsData = async() => {
        try {
          const response = await getAllCalendarEvents();
  
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
  
          const calendar = await response.json();
          setAllCalendarEventsData(calendar);
        } catch (err) {
          console.error(err);
        }
      };
      
      const interval = setInterval(() => {
          getAllCalendarEventsData();
      }, 30000);
      getAllCalendarEventsData();
  
      return () => clearInterval(interval);
  
    }, [calendarEventsDataLength]);
      
    if (!calendarEventsDataLength) {
      return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress color="secondary" disableShrink />
        </Box>
      );
    }
  
    const tableStyles = {
      marginLeft: '1%',
      width: '90%'
    }
  
    const tableField = {
      borderBottom: 'solid 1px',
      fontSize: '18px',
      width: '25%'
    }
    
    return (
      <>
        <div>
          {calendarData}
        </div>
      </>
    );
  };
  

export default SetCalendar;