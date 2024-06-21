import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Contact = (data:any) => {
  let options = data.options;
  if(options) {
    if(options[options.length-1] != "Hold") {
      options[options.length] = "Auto-Email";
      options[options.length] = "Hold";
    }
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