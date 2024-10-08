import React, { useState, useEffect } from 'react';
import { getMailGunFailedEvents } from '../../utils/GetDataAPI';

const GetMailGunFailedEvents = () => {
  const [data, setData] = useState<any>({});

  const dataLength = Object.keys(data).length;

  useEffect(() => {
    const apiCall = async () => {
      const response = await getMailGunFailedEvents();

      const apiData = await response.json();

      setData(apiData);
    }

    apiCall();
  }, [dataLength])

  if (!dataLength) {
    return <h2>LOADING...</h2>;
  }

  const getTime = (timestamp:number) => {
    let date = new Date(timestamp*1000);
    const hours = [["12","AM"], ["1","AM"], ["2","AM"], ["3","AM"], ["4","AM"], ["5","AM"], ["6","AM"], ["7","AM"], ["8","AM"], ["9","AM"], ["10","AM"], ["11","AM"], 
          ["12", "PM"], ["1", "PM"], ["2", "PM"], ["3", "PM"], ["4", "PM"], ["5", "PM"], ["6", "PM"], ["7", "PM"], ["8", "PM"], ["9", "PM"], ["10", "PM"], ["11", "PM"]];
    const minuteBuilder = () => {
      // Math.floor will round down the results from the getMinutes/10 leaving whatever digit was in the tens place now in the ones place.
      // After the digit that was in the tens place is placed into the ones place we can then mod the digit
      // if it is anything other than 0. If 0 then the Minutes are going to have a leading 0.
      if(Math.floor(date.getMinutes()/10)%10 == 0) {  
        return `0${date.getMinutes()}`;
      }
      return date.getMinutes();
    }
    let formattedDate = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} at ${hours[date.getHours()][0]}:${minuteBuilder()} ${hours[date.getHours()][1]}`;
    return `${formattedDate}`;
  }

  const tableBuilder = () => {
    const tableHeaders: any = <thead>
      <tr style={{ borderBottom: '3px solid'}}>
        <td style={{ paddingRight: '50px' }}>Recipient</td>
        <td style={{ paddingRight: '50px' }}>Reason</td>
        <td style={{ paddingRight: '50px' }}>Severity</td>
        <td style={{ paddingRight: '50px' }}>Log Level</td>
        <td style={{ paddingRight: '50px' }}>Date & Time</td>
      </tr>
    </thead>;
    let tableBody: any[] = new Array();
    let tableData: any[] = new Array();
    tableData.push(tableHeaders);
    for (let i = 0; i < data.items.length; i++) {
      tableBody.push(<tr key={i} style={{ borderBottom: '1px solid'}}>
        <td style={{ paddingRight: '50px' }}>{data.items[i].recipient}</td>
        <td style={{ paddingRight: '50px' }}>{data.items[i].reason}</td>
        <td style={{ paddingRight: '50px' }}>{data.items[i].severity}</td>
        <td style={{ paddingRight: '50px' }}>{data.items[i]['log-level']}</td>
        <td style={{ paddingRight: '50px' }}>{getTime(data.items[i].timestamp)}</td>
      </tr>);
    }

    tableData.push(<tbody>{tableBody}</tbody>);

    return tableData;
  }

  return (
    <>
      <div id="displayData">
        <table>
          {tableBuilder()}
        </table>
      </div>
    </>
  );
};

export default GetMailGunFailedEvents;