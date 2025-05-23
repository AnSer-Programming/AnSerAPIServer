import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectHoliday = (data: any) => {
  useEffect(()=>{
  },[data.selectedHoliday]);

  return (
    <>
      <br /><br />
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            data.handlerChangeHoliday(newValue);
          } 
          if(!newValue) {
            data.handlerChangeHoliday("None");
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            data.handlerChangeHoliday("None");
          }
        }}
        isOptionEqualToValue={(option, value) => option.value === value}
        options={data.holidays}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        value={data.selectedHoliday}
        renderInput={(params) => <TextField {...params} label={"Holiday List"} variant="filled" sx={{ zIndex: 0 }} />}
      /><br />
    </>
  );
}

export default SelectHoliday