import React from 'react';
import TextField from '@mui/material/TextField';

const SetContactDispatchAccountNum = (data:any) => {
  return (
    <>
    <TextField label={data.api}
      sx={{background: 'white'}}
      InputProps={{
        readOnly: false,
      }} />
    </>
  );
};

export default SetContactDispatchAccountNum;