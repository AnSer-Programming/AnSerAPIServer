import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetContactDispatchAccountStatus = (data:any) => {
  const [statusOptions, setStatus] = useState<any[]>([]);
  useEffect(() => {
    setStatus(["Contact Dispatch", "Delivery Screen", "System Script", "Agent Account", "Client Off Service", "Cue"]);
  }, []);

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newInputValue) => {
          data.updateHandler(newInputValue);
        }}
        options={statusOptions}
        sx={{background: 'white'}}
        renderInput={(params) => <TextField {...params} value={data.status} />}
      /> 
    </>
  );
};

export default SetContactDispatchAccountStatus;