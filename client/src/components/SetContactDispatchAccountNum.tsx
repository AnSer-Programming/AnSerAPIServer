import TextField from '@mui/material/TextField';

const SetContactDispatchAccountNum = (data:any) => {
  return (
    <>
      <TextField label={data.accountNum}
        disabled
        id="filled-read-only-input"
        sx={{background: 'white'}}
        InputProps={{
          readOnly: true,
        }}
        variant="filled"
      />
    </>
  );
};

export default SetContactDispatchAccountNum;