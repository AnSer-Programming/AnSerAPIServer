import React, { useState, useEffect } from 'react';
import { getISHolidays, getISHolidaysByNum, getISHolidaysByName } from '../../utils/GetDataAPI';
import DefaultPage from './GetISHolidaysComponents/Index';
import AccountInformation from './GetISHolidaysComponents/HolidaysByAccount';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';

const GetISHolidays = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>(0);
  const [accountNumbers, setAccountNumbers] = useState<any[]>([]);
  const holidayDataLength = Object.keys(holidayData).length;

  useEffect(() => {
    const getAccountNumbers = async () => {
      try {
        let placeHolder: any[] = new Array();
        placeHolder[0] = '0';
        for (let i = 0; i < data.accountNumbers.length; i++) {
          // console.log(data.accountNumbers[i]);
          placeHolder[i + 1] = await data.accountNumbers[i];
        }

        setAccountNumbers(placeHolder);
      } catch (err) {
        console.log(err);
      }
    }

    const getHolidayData = async () => {
      try {
        let data: any;
        if (accountNum == 0) {
          const response = await getISHolidays();
          data = await response.json();
        } else {
          const response = await getISHolidaysByNum(accountNum);
          data = await response.json();
        }
        setHolidayData(data);
      } catch (err) {
        console.log(err);
      }
    }

    getHolidayData();
    getAccountNumbers();
  }, [holidayDataLength, accountNum, data.accountNumbers]);

  const componentHandler = () => {
    if (accountNum == 0) {
      return (<><DefaultPage
        holidays={holidayData} /></>);
    } else {
      return (<><AccountInformation
        holidays={holidayData} /></>);
    }
  }

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setAccountNum(parseInt(newValue));
          }
        }}
        options={accountNumbers}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{ zIndex: 0 }} />}
      /> <br />
      <p>Use Account Number 0 to view all system holidays</p>
      {
        holidayData ?
          componentHandler() :
          <h1>Loading . . .</h1>
      }
    </>
  );
};

export default GetISHolidays;