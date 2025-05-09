import { React, useState, useEffect } from 'react';
import InfoPageSearch from '../components/BackUps/InfoPageSearch.tsx';
import GetInfoPages from '../components/BackUps/GetInfoPages.tsx';
import Menu from '../components/Menu.tsx';

const Info = () => {
  const [accountNum, setAccountNum] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [date, setDate] = useState();

  useEffect(() =>{},[accountNum]);

  function searchHandler(accountNum, yearInput, monthInput) {
    setAccountNum(accountNum);
    setMonth(monthInput);
    setYear(yearInput);
    setDate(`${monthInput}-${yearInput}`);
    console.log(accountNum, yearInput, monthInput);
  }

  const displayInfoPage = () => {
    console.log("Display Info Page");
    return(
      <GetInfoPages
        accountNum = {accountNum}
        year = {year}
        month = {month}
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
          returnData = {(accountNum, year, month) => {searchHandler(accountNum, year, month);}} />
        { accountNum ? displayInfoPage() : blank()}
      </div>
    </>
  );
};

export default Info;