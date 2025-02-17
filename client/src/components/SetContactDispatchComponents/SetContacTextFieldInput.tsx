import TextField from '@mui/material/TextField';

const SetContacTextFieldInput = (data: any) => {
  return (
    <>
      <TextField label={data.placeHolder}
        sx={{ background: 'white', width: '99%', margin: '0px', padding: '0px' }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          data.updateHandler(event.target.value);
        }}
        InputProps={{
          readOnly: false,
        }}
      />
    </>
  );
};

export default SetContacTextFieldInput;