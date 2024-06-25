import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Contact = (data:any) => {
  let options = data.options;
  if(options) {
    if(options[options.length-1] != "Hold") {
      options[options.length] = "Auto-Email";
      options[options.length] = "Hold";
    }
  }

  let optionsLength = options.length;

  if (!optionsLength) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="secondary" disableShrink />
      </Box>
    );
  }

  return (
    <Autocomplete
      id={"contact"}
      disablePortal
      onChange={(event, newInputValue) => {
        data.contactEdit(newInputValue);
      }}
      options={data.options}
      sx={{ width: 250, background: 'white', zIndex: 0 }}
      renderInput={(params) => <TextField {...params} label={data.contacts} 
      variant="filled"/>}
    /> 
  )
}

export default Contact;