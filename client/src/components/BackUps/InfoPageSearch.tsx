import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getAccountsWithBackedUpInfoPages } from '../../utils/GetDataAPI';

const InfoPageSearch = (data: any) => {
  const [searchCriteria, setSearchCriteria] = useState<any>({});
  const [years, setYears] = useState<any[]>([]);
  const [months, setMonths] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(-1);
  const [selectedMonth, setSelectedMonth] = useState<number>(-1);
  const [selectedDay, setSelectedDay] = useState<number>(-1);
  const [accountNum, setAccountNum] = useState<number>(-1);
  const clientsDataLength = Object.keys(searchCriteria).length;

  useEffect(() => {
    const getAcountNumbers = async () => {
      const response = await getAccountsWithBackedUpInfoPages();
      let accountNum = new Array();
      let searchData: any = {};

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      let data = await response.json();

      for (let x = 0; x < data.length; x++) {
        if (searchData.length == 0) {
          searchData[data[x].client_number] = [{ year: data[x].date_added.split('-')[2], month: data[x].date_added.split('-')[1], day: data[x].date_added.split('-')[0] }];
          accountNum[x] = data[x].client_number;
        } else {
          if (searchData[data[x].client_number]) {
            searchData[data[x].client_number][searchData[data[x].client_number].length] = { year: data[x].date_added.split('-')[2], month: data[x].date_added.split('-')[1], day: data[x].date_added.split('-')[0] };
          } else {
            accountNum[x] = data[x].client_number;
            searchData[data[x].client_number] = [{ year: data[x].date_added.split('-')[2], month: data[x].date_added.split('-')[1], day: data[x].date_added.split('-')[0] }];
          }
        }
      }

      setSearchCriteria(searchData);
    }

    getAcountNumbers();
  }, [clientsDataLength, accountNum, selectedDay, selectedMonth, selectedYear, years, months, days]);

  if (!clientsDataLength) {
    <h2>LOADING...</h2>
  }

  const searchHandler = (accountNumber: any, year: any, month: any, day: any) => {
    if (accountNumber && year != -1 && month != -1 && day != -1) {
      data.returnData(accountNumber, year, month, day);
    }
  }

  const accountHandler = async (accountNumber: number, year: number, month: number, day: number) => {
    if (accountNumber != accountNum) {
      setSelectedYear(-1);
      setSelectedMonth(-1);
      setSelectedDay(-1);
    }
    setAccountNum(accountNumber);
    searchHandler(accountNumber, year, month, day);
    let yearExists = false;
    let monthExists = false;
    let dayExists = false;
    let years = new Array();
    let months = new Array();
    let days = new Array();
    for (let i = 0; i < searchCriteria[accountNumber].length; i++) {
      yearExists = false;
      if (years.length == 0) {
        years.push(searchCriteria[accountNumber][i].year);
      } else {
        for (let x = 0; x < years.length; x++) {
          if (years[x] == searchCriteria[accountNumber][i].year) {
            yearExists = true;
          }
          if (yearExists) {
            break;
          } else if (x == years.length-1) {
            years.push(searchCriteria[accountNumber][i].year);
          }
        }
      }
      if (year != -1) {
        if (year == searchCriteria[accountNumber][i].year) {
          if (months.length == 0) {
            months.push(searchCriteria[accountNumber][i].month);
          } else {
            monthExists = false;
            for (let x = 0; x < months.length; x++) {
              if (months[x] == searchCriteria[accountNumber][i].month) {
                monthExists = true;
              }
            }
            if (!monthExists) {
              months.push(searchCriteria[accountNumber][i].month);
            }
          }
        }
        if (month != -1) {
          if (month == searchCriteria[accountNumber][i].month) {
            days.push(searchCriteria[accountNumber][i].day);
          }
        }
      }
    }
    years.sort((x, y) => Math.abs(x) - Math.abs(y));
    months.sort((x, y) => Math.abs(x) - Math.abs(y));
    days.sort((x, y) => Math.abs(x) - Math.abs(y));
    setYears(years);
    setMonths(months);
    setDays(days);
  }

  const year = () => {
    return (
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setSelectedYear(parseInt(newValue));
            accountHandler(accountNum, newValue, selectedMonth, selectedDay);
          }
          if (!newValue) {
            setSelectedYear(-1);
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            setSelectedYear(-1);
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        options={years}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={selectedYear} label={"Select a Year"} variant="filled" sx={{ zIndex: 0 }} />}
      />
    )
  }

  const month = () => {
    return (
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setSelectedMonth(parseInt(newValue));
            setSelectedDay(-1);
            accountHandler(accountNum, selectedYear, newValue, selectedDay);
          }
          if (!newValue) {
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        options={months}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={selectedMonth} label={"Select a Month"} variant="filled" sx={{ zIndex: 0 }} />}
      />
    )
  }

  const day = () => {
    return (
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setSelectedDay(parseInt(newValue));
            accountHandler(accountNum, selectedYear, selectedMonth, newValue);
          }
          if (!newValue) {
            setSelectedDay(-1);
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            setSelectedDay(-1);
          }
        }}
        options={days}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={selectedDay} label={"Select a Day"} variant="filled" sx={{ zIndex: 0 }} />}
      />
    )

  }

  const blank = () => {
    return (
      <br />
    )
  }

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            accountHandler(parseInt(newValue), -1, -1, -1);
          }
          if (!newValue) {
            setAccountNum(-1);
            setSelectedYear(-1);
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        onInputChange={(event, value, reason) => {
          if (reason == "clear") {
            setAccountNum(-1);
            setSelectedYear(-1);
            setSelectedMonth(-1);
            setSelectedDay(-1);
          }
        }}
        options={Object.keys(searchCriteria)}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{ zIndex: 0 }} />}
      />
      {accountNum == -1 ? blank() : year()}
      {selectedYear == -1 ? blank() : month()}
      {selectedMonth == -1 ? blank() : day()}
    </>
  )
}

export default InfoPageSearch;