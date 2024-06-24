import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const VesselContact = (data:any) => {
  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  return (
    <td key={data.contact_name} style={fieldStyles}>
      Contact: <br />
      { 
        data.contact_name === "Misc" ?
        <TextField label={data.contact_name} 
          variant="filled"
          disabled  
          InputLabelProps={{
            style: { color: '#000000', fontWeight: 'bolder' },
          }}
          sx={{ width: 250, background: 'white', zIndex: 0 }} /> :
        <Autocomplete
          id={"vesselInput"}
          disablePortal
          onChange={(event, newInputValue) => {
            data.vesselEdit(data.i, newInputValue, );
          }}
          options={data.options}
          sx={{ width: 250, background: 'white', zIndex: 0 }}
          renderInput={(params) => <TextField {...params} label={data.contact_name} 
          variant="filled"/>}
        />  
      }
    </td>
  )
}

export default VesselContact;