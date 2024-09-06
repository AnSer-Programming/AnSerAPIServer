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

  const tableBuilder = () => {
    const tableHeaders: any = <thead>
      <tr style={{ borderBottom: '3px solid'}}>
        <td style={{ paddingRight: '50px' }}>Recipient</td>
        <td style={{ paddingRight: '50px' }}>Reason</td>
        <td style={{ paddingRight: '50px' }}>Severity</td>
        <td style={{ paddingRight: '50px' }}>Log Level</td>
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