import TextField from '@mui/material/TextField';

const VesselContact = (data:any) => {
  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  return (
    <td key={data.vessel_name} style={fieldStyles}>
      Vessel: <br />
      <TextField label={data.vessel_name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          data.vesselEdit(data.i, event.target.value);
        }} 
        sx={{ width: 250, background: 'white', zIndex: 0 }}
        variant="filled" />
    </td> 
  )
}

export default VesselContact;