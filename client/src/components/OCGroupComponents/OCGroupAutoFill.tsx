import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const OCGroup = (data: any) => {
  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  return (
    <td key={data.facility+"_"+data.on_call_group_name} style={fieldStyles}>
      {data.on_call_group_name}: <br />
      <Autocomplete
        id={"onCallGroupInput"}
        disablePortal
        onChange={(event, newInputValue) => {
          data.onCallGroupEdit(data.i, newInputValue,);
        }}
        options={data.options}
        sx={{ width: 250, background: 'white', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} label={data.on_call_group}
          variant="filled" />}
      />
    </td>
  )
}

export default OCGroup;