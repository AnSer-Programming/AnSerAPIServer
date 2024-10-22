import TextField from '@mui/material/TextField';

const SetBranchInfo = (data:any) => {
  return (
    <TextField label={data.label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        data.contactEdit(data.i, event.target.value);
      }} 
      sx={{ width: 250, background: 'white', zIndex: 0 }}
      variant="filled" />
  )
}

export default SetBranchInfo;