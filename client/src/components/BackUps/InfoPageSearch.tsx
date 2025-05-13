import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getAccountsWithBackedUpInfoPages } from '../../utils/GetDataAPI';

const InfoPageSearch = (data:any) => {
  const [searchCriteria, setSearchCriteria] = useState<any>({});
  const [years, setYears] = useState<any[]>([]);
  const [months, setMonths] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState<any>();
  const [accountNum, setAccountNum] = useState<number>(0);
  const clientsDataLength = Object.keys(searchCriteria).length;

  useEffect(() => {
    const getAcountNumbers = async () => {
      const response = await getAccountsWithBackedUpInfoPages();
      let accountNum = new Array();
      let searchData:any = {};

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      let data = await response.json();

      for (let x = 0; x < data.length; x++) {
        if(!searchData[0]) {
          searchData[data[x].client_number] = [{year: data[x].date_added.split('-')[1], month: data[x].date_added.split('-')[0]}];
          accountNum[x] = data[x].client_number;
        } else {
          for(let y = 0; y < searchData.length; y++) {
            if(searchData[y].client_number == data[x].client_number) {
              searchData[data[x].client_number] += {year: data[x].date_added.split('-')[1], month: data[x].date_added.split('-')[0]};
            } else if(y = searchData.length) {
              accountNum[x] = data[x].client_number;
              searchData[data[x].client_number] = [{year: data[x].date_added.split('-')[1], month: data[x].date_added.split('-')[0]}];
            }
          }
        }
      }
      setSearchCriteria(searchData);
    }

    getAcountNumbers();
  }, [clientsDataLength, accountNum, selectedMonth, selectedYear]);

  if (!clientsDataLength) {
    <h2>LOADING...</h2>
  }

  console.log(data);

  const searchHandler = (accountNumber:any, year:any, month:any) => {
    if(accountNumber && year && month) {
      data.returnData(accountNumber, year, month);
    }
  }

  const accountHandler = async(accountNumber:number) => {
    setAccountNum(accountNumber);
    searchHandler(accountNumber, selectedYear, selectedMonth);
    let years = new Array();
    let months = new Array();
    for(let i = 0; i < searchCriteria[accountNumber].length; i++) {
      years.push(searchCriteria[accountNumber][i].year);
      months.push(searchCriteria[accountNumber][i].month);
    }
    setYears(years);
    setMonths(months);
  }

  const yearMonth = () => {
    return (
      <>
        <Autocomplete
          disablePortal
          onChange={(event, newValue: any) => {
            if (newValue) {
              setSelectedYear(parseInt(newValue));
              searchHandler(accountNum, newValue, selectedMonth);
            }
          }}
          options={years}
          sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
          renderInput={(params) => <TextField {...params} value={selectedYear} label={"Select a Year"} variant="filled" sx={{ zIndex: 0 }} />}
        /> 
        <Autocomplete
          disablePortal
          onChange={(event, newValue: any) => {
            if (newValue) {
              setSelectedMonth(parseInt(newValue));
              searchHandler(accountNum, selectedYear, newValue);
            }
          }}
          options={months}
          sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
          renderInput={(params) => <TextField {...params} value={selectedMonth} label={"Select a Month"} variant="filled" sx={{ zIndex: 0 }} />}
        /> 
      </>
    )
  }

  const blank = () => {
    return(
      <br />
    )
  }

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            accountHandler(parseInt(newValue));
          }
        }}
        options={Object.keys(searchCriteria)}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{ zIndex: 0 }} />}
      /> 
      { !accountNum ? blank() : yearMonth() }
    </>
  )
}

export default InfoPageSearch;