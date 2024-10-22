import React, { useState, useEffect } from 'react';
import { getClients, getClientsByNum, getClientsByName } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetClients = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;

  useEffect(() => {
    const getClientsData = async () => {
      try {
        let response;
        setPageNum(0);
        if (accountNum) {
          response = await getClientsByNum(accountNum);
          if (!response.ok) {
            response = await getClients();
          }
        } else if (accountName) {
          response = await getClientsByName(accountName);
          if (!response.ok) {
            response = await getClients();
          }
        } else {
          response = await getClients();
        }

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        setClientsData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength, accountNum, accountName]);

  const pageChangeHandler = (direction: String, input: number) => {
    if (direction === "Select") {
      if (input > maxPages) {
        setPageNum(maxPages);
      } else if (input < 0 || !input) {
        setPageNum(0);
      } else if (input) {
        setPageNum(input);
      }
    } else if (direction === 'Next') {
      if (pageNum < maxPages) {
        setPageNum(pageNum + 1);
      }
    } else {
      if (pageNum > 0) {
        setPageNum(pageNum - 1);
      }
    }
  }

  const maxPageSetter = () => {
    maxPages = (Math.ceil((clientsDataLength / 50) - 1));
  }

  const assignRegion = (accountNum: number) => {
    if (accountNum > 0 && accountNum < 1000) { // GreenBay/GulfPort
      return "GreenBay/GulfPort";
    } else if (accountNum > 999 && accountNum < 3000) { // GreenBay, WI/non-AnsaVoice California(CA)
      return "GreenBay, WI/non-AnsaVoice California(CA)";
    } else if (accountNum > 2999 && accountNum < 3300) { // GreenBay, WI
      return "GreenBay, WI";
    } else if (accountNum > 3299 && accountNum < 3598) { // Oconomowoc, WI
      return "Oconomowoc, WI";
    } else if (accountNum > 3597 && accountNum < 4000) { // Kentucky(KY)
      return "Kentucky(KY)";
    } else if (accountNum > 3999 && accountNum < 5000) { // GreenBay(Mainly Operator Audio), WI/Michigan
      return "GreenBay(Mainly Operator Audio), WI/Michigan";
    } else if (accountNum > 4999 && accountNum < 5300) { // Green Bay, WI
      return "Green Bay, WI";
    } else if (accountNum > 5299 && accountNum < 5400) { // Janesville, WI
      return "Janesville, WI";
    } else if (accountNum > 5399 && accountNum < 5500) { // Rochester, NY
      return "Rochester, NY";
    } else if (accountNum > 5499 && accountNum < 5900) { // Montana(MT)
      return "Montana(MT)";
    } else if (accountNum > 5899 && accountNum < 6000) { // AnsaVoice - California(CA)
      return "AnsaVoice - California(CA)";
    } else if (accountNum > 5999 && accountNum < 6500) { // Baton Rouge, LA
      return "Baton Rouge, LA";
    } else if (accountNum > 6499 && accountNum < 6700) { // GreenBay, WI
      return "GreenBay, WI";
    } else if (accountNum > 6699 && accountNum < 7000) { // Charleston, WV
      return "Charleston, WV";
    } else if (accountNum > 6999 && accountNum < 8000) { // GreenBay, WI
      return "GreenBay, WI";
    } else if (accountNum > 7999 && accountNum < 9000) { // Gulfport, MS
      return "Gulfport, MS";
    } else if (accountNum > 8999 && accountNum < 9700) { // Internal Accounts
      return "Internal Accounts";
    } else if (accountNum > 9699 && accountNum < 10000) { // Janesville, WI
      return "Janesville, WI";
    } else if (accountNum > 9999 && accountNum < 11720) { // Internal/Sub-Accounts for any office
      return "Internal/Sub-Accounts for any office";
    } else if (accountNum > 11719 && accountNum < 20000) { // Appleton, WI
      return "Appleton, WI";
    } else if (accountNum > 19999 && accountNum < 25000) { // Baton Rouge, LA
      return "Baton Rouge, LA";
    } else if (accountNum > 24999 && accountNum < 30000) { // Utica, NY
      return "Utica, NY";
    } else if (accountNum > 29999 && accountNum < 40000) { // Albuquerque, NM
      return "Albuquerque, NM";
    } else if (accountNum > 39999 && accountNum < 50000) { // Eugene, OR
      return "Eugene, OR";
    } else if (accountNum > 49999 && accountNum < 60000) { // Chicago, IL
      return "Chicago, IL";
    } else if (accountNum > 59999 && accountNum < 70000) { // Des Moies, IA
      return "Des Moies, IA";
    } else if (accountNum > 79999 && accountNum < 90000) { // Wausau, WI
      return "Wausau, WI";
    } else if (accountNum > 89999 && accountNum < 100000) { // AnsaVoice - California(CA)
      return "AnsaVoice - California(CA)";
    } else {
      return "Sub-Accounts/Operator Audio";
    }
  }

  return (
    <>
      {maxPageSetter()}
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select", parseInt(event.target.value) - 1);
        }}
          sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0 }}
          variant="filled" />
      </Tooltip>
      <TextField label={"Account Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNum(parseInt(event.target.value));
      }}
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0 }}
        variant="filled" />
      <TextField label={"Account Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(event.target.value);
      }}
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0 }}
        variant="filled" /> <br /><br />
      {
        clientsDataLength ?
          <table>
            <tbody>
              {(function () {
                let length: number = 50;
                let start: number = length * pageNum;
                let rows: any = [];
                for (let i = 0; i < length; i++) {
                  if (clientsData[i + start] == undefined) {
                    break;
                  } else {
                    rows.push(
                      <tr key={i} style={{ minWidth: '100%' }}>
                        <td style={{ paddingRight: '25px' }}>Client Number: {clientsData[i + start].ClientNumber}</td>
                        <td style={{ paddingRight: '25px' }}>Client: {clientsData[i + start].ClientName}</td>
                        <td style={{ paddingRight: '25px' }}>Region: {assignRegion(clientsData[i + start].ClientNumber)}</td>
                        <td style={{ paddingRight: '25px' }}>Start Date: {(
                          function () {
                            let dateTime = clientsData[i + start].Stamp.split(" ");
                            for (let x = 0; x < dateTime.length; x++) {
                              if (dateTime[x] === "") {
                                for (let y = x; y < dateTime.length; y++) {
                                  dateTime[y] = dateTime[y + 1];
                                }
                              }
                            }
                            return `${dateTime[0]} ${dateTime[1]} ${dateTime[2]}`
                          }())}
                        </td>
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      } <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetClients;