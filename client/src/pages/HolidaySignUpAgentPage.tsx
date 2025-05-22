import React, { useState, useEffect } from 'react';
// import InfoPageSearch from '../components/BackUps/InfoPageSearch.tsx';
// import GetInfoPages from '../components/BackUps/GetInfoPages.tsx';

const HolidaySignUpAgentPage = () => {
  const [holiday, setHoliday] = useState();

  useEffect(() =>{},[holiday]);

  const displayInfoPage = () => {
    return(
      <>
      <p>Some Text</p>
      </>
    )
  }

  const blank = () => {
    return(
      <>
      <p>Some Text</p><br />
      </>
    )
  }

  return (
    <>
      <div style={{ width: '50%' }}>
        { holiday ? displayInfoPage() : blank()}
      </div>
    </>
  );
};

export default HolidaySignUpAgentPage;