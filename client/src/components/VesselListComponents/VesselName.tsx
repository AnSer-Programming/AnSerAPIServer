import TextField from '@mui/material/TextField';

const VesselName = (data:any) => {
  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  return (
    <td key={data.vessel_name} style={fieldStyles}>
      Vessel: <br />
      { 
        data.vessel_name === "Unlisted" ?
        <TextField label={data.vessel_name} 
          disabled
          InputLabelProps={{
            style: { color: '#000000', fontWeight: 'bolder' },
          }}
          sx={{ width: 250, background: 'white', zIndex: 0 }}
          variant="filled" /> :
        <TextField label={data.vessel_name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            data.vesselEdit(data.i, event.target.value);
          }} 
          sx={{ width: 250, background: 'white', zIndex: 0 }}
          variant="filled" />
        }
    </td> 
  )
}

export default VesselName;