import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectAgent = (data: any) => {
  useEffect(()=>{},[data.selectedHoliday]);

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if(newValue == null) {
            data.handlerChangeAgent("Available", data.holidayID, data.shiftID);
          } else if (newValue) {
            data.handlerChangeAgent(newValue, data.holidayID, data.shiftID);
          } 
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            data.handlerChangeAgent("Available", data.holidayID, data.shiftID);
          }
        }}
        disableClearable
        isOptionEqualToValue={(option, value) => option.value === value}
        options={data.agents}
        value={data.selectedAgent}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} label={"Agent"} variant="filled" sx={{ zIndex: 0 }} />}
      /><br />
    </>
  );
}

export default SelectAgent