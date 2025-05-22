import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectAgent = (data: any) => {
  useEffect(()=>{
  },[data.selectedHoliday]);

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            data.handlerChangeAgent(newValue, data.holidayID, data.shiftID);
          } 
          if(!newValue) {
            data.handlerChangeAgent("Available", data.holidayID, data.shiftID);
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            data.handlerChangeAgent("Available", data.holidayID, data.shiftID);
          }
        }}
        // isOptionEqualToValue={(option, value) => option.value === value}
        options={data.agents}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        // value={data.selectedAgent}
        renderInput={(params) => <TextField {...params} label={data.selectedAgent} variant="filled" sx={{ zIndex: 0 }} />}
      /><br />
    </>
  );
}

export default SelectAgent