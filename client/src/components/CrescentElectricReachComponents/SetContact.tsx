import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const SetContact = (data:any) => {
  return (
    <Autocomplete
      id={data.id}
      disablePortal
      onChange={(event, newInputValue) => {
        data.contactEdit(data.i, newInputValue, );
      }}
      options={data.options}
      sx={{ width: 250, background: 'white', zIndex: 0 }}
      renderInput={(params) => <TextField {...params} label={data.label} 
      variant="filled"/>}
    /> 
  )
}

export default SetContact;