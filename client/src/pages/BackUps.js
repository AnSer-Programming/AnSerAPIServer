import { React, useState, useEffect } from 'react';
import InfoPageSearch from '../components/BackUps/InfoPageSearch.tsx';
import GetInfoPages from '../components/BackUps/GetInfoPages.tsx';
import Menu from '../components/Menu.tsx';

const Info = () => {
  const [accountNum, setAccountNum] = useState();
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [date, setDate] = useState();

  useEffect(() =>{},[accountNum]);

  function searchHandler(accountNum, yearInput, monthInput, dayInput) {
    setAccountNum(accountNum);
    setDay(dayInput);
    setMonth(monthInput);
    setYear(yearInput);
    setDate(`${dayInput}-${monthInput}-${yearInput}`);
  }

  const displayInfoPage = () => {
    return(
      <GetInfoPages
        accountNum = {accountNum}
        year = {year}
        month = {month}
        day = {day}
        date = {date} />
    )
  }

  const blank = () => {
    return(
      <br />
    )
  }

  return (
    <>
      <div style={{ width: '50%' }}>
        <InfoPageSearch 
          returnData = {(accountNum, year, month, day) => {searchHandler(accountNum, year, month, day);}} />
        { accountNum ? displayInfoPage() : blank()}
      </div>
    </>
  );
};

export default Info;