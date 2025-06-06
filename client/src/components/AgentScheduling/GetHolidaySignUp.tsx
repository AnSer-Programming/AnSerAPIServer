import React, { useState, useEffect } from 'react';
import { getHolidayData, getHolidaySignUp } from '../../utils/AgentSuccessAPI';
import ContentBuilder from './ContentBuilder';

const GetHolidaySignUp = (data: any) => {
  const [holidayData, setHolidayData] = useState<any>([]);
  const holidayDataLength = Object.keys(holidayData).length;

  useEffect(() => {
    const getCompleteHolidayData = async () => {
      try {
        if (data.selectedHoliday != "None") {
          let response = await getHolidayData(data.selectedHoliday);
          let responseData = new Array();
          // const holidays = new Array();

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[0] = await response.json();
          response = await getHolidaySignUp(data.selectedHoliday);

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          responseData[1] = await response.json();

          setHolidayData(responseData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getCompleteHolidayData();
  }, [holidayDataLength, data.selectedHoliday, data.selectedEmployeeType]);

  return (
    <>
      <ContentBuilder
        holidayData={holidayData}
        selectedHoliday={data.selectedHoliday}
        selectedEmployeeType={data.selectedEmployeeType} />
    </>
  )
}

export default GetHolidaySignUp;