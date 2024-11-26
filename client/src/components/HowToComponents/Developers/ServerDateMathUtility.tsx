const ServerDateMathUtility = () => {
  return (
    <>
      <div id='serverDateMathUtilityContentHolder'>
        <h1>Formatting</h1>
        <p>Currently the Date Math Utility is set up to work with only one format of date.</p>
        <p>Expected format = yyyy-m-d</p>
        <ul>
          <li>yyyy means that the year will always have to be 4 digits</li>
          <li>m means that the month can be either 1 or 2 digits</li>
          <li>d means that the day can be either 1 or 2 digits</li>
          <li>The server will be looking for the - as the delimiter character between the year month and day</li>
          <li>The server is set up to assume that you are <strong>ALWAYS</strong> going to enter the date as year-month-day</li>
        </ul>
        <p>The date math calculater tool will calculate if it is a leap year or not using the leaYearCheck function.</p>
        <h1>Available Modules</h1>
        <p>All modules below will require a date parameter to be passed to it.</p>
        <h2>tomorrow</h2>
        <p>Returned format = yyyy-mm-dd</p>
        <h2>tomorrowWithoutLeadZero</h2>
        <p>Returned format = yyyy-m-d</p>
        <p>This option exists because SQL will leave white space instead of appending a zero to the beginning of the day or month.</p>
        <h2>yesterday</h2>
        <p>Returned format = yyyy-mm-dd</p>
        <h2>yesterdayWithoutLeadingZero</h2>
        <p>Returned format = yyyy-m-d</p>
        <p>This option exists because SQL will leave white space instead of appending a zero to the beginning of the day or month.</p>
        <h2>isSaturday</h2>
        <p>This module will return a boolean of true is the date that was sent is a Saturday. Otherwise it will return false.</p>
        <h2>isSunday</h2>
        <p>This module will return a boolean of true is the date that was sent is a Sunday. Otherwise it will return false.</p>
        <h2>isWeekend</h2>
        <p>This module will return a boolean of true is the date that was sent is a part of the weekend (Saturday or Sunday). Otherwise it will return false.</p>
        <h2>isWeekday</h2>
        <p>This module will return a boolean of true is the date that was sent is a part of the weekday (not Saturday and not Sunday). Otherwise it will return false.</p>
      </div>
    </>
  )
}

export default ServerDateMathUtility;



/*
  * Expected Format:
  * yyyy-m-d
  * Returned Format:
  * yyyy-mm-dd
*/