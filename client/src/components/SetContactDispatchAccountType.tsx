import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetContactDispatchAccountType = (data:any) => {
  const [typeOptions, setType] = useState<any[]>([]);
  useEffect(() => {
    setType(["HVAC", "Medical", "Realty", "Funeral Home", "Plumbing", "Tech"]);
  }, []);

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newInputValue) => {
          data.handleContactDispatchEdit(event, newInputValue, "Person");
        }}
        options={typeOptions}
        sx={{background: 'white'}}
        renderInput={(params) => <TextField {...params} value={data.type} />}
      /> 
    </>
  );
};

export default SetContactDispatchAccountType;