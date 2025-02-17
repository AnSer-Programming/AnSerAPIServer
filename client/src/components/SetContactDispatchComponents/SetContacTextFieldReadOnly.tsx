import TextField from '@mui/material/TextField';

const SetContacTextFieldReadOnly = (data: any) => {
  return (
    <>
      <TextField label={data.placeHolder}
        disabled
        id="filled-read-only-input"
        sx={{ background: 'white', width: '99%', margin: '0px', padding: '0px' }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          data.updateHandler(event);
        }}
        InputProps={{
          readOnly: true,
        }}
        variant="filled"
      />
    </>
  );
};

export default SetContacTextFieldReadOnly;