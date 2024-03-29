import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetContactDispatchAccountType = (data:any) => {
  const [typeOptions, setType] = useState<any[]>([]);
  useEffect(() => {
    setType((["HVAC", "Medical", "Realty", "Funeral Home", "Plumbing", "Tech"]).sort());
  }, []);

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newInputValue) => {
          data.updateHandler(newInputValue);
        }}
        options={typeOptions}
        sx={{background: 'white', width: '75%'}}
        renderInput={(params) => <TextField {...params} value={data.type} />}
      /> 
    </>
  );
};

export default SetContactDispatchAccountType;