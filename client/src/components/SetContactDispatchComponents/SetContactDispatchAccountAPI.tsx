import React from 'react';
import TextField from '@mui/material/TextField';

const SetContactDispatchAccountNum = (data:any) => {
  return (
    <>
    <TextField label={data.api}
      sx={{background: 'white', width: '75%'}}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        data.updateHandler(event);
      }}
      InputProps={{
        readOnly: false,
      }} />
    </>
  );
};

export default SetContactDispatchAccountNum;