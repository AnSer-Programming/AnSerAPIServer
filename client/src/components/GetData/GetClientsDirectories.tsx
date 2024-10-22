import React, { useState, useEffect } from 'react';
import { getClientsDirectories, getClientsDirectoriesByNum, getClientsDirectoriesByName, getClientsDirectoriesByDirectory } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetClientsDirecoties = () => {
  const [clientsDirectoriesData, setClientsDirectoriesData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [directoryName, setDirectoryName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDirectoriesDataLength = Object.keys(clientsDirectoriesData).length;

  useEffect(() => {
    const getClientsDirectoriesData = async () => {
      try {
        let response;
        setPageNum(0);
        if (accountNum) {
          response = await getClientsDirectoriesByNum(accountNum);
          if (!response.ok) {
            response = await getClientsDirectories();
          }
        } else if (accountName) {
          response = await getClientsDirectoriesByName(accountName);
          if (!response.ok) {
            response = await getClientsDirectories();
          }
        } else if (directoryName) {
          response = await getClientsDirectoriesByDirectory(directoryName);
          if (!response.ok) {
            response = await getClientsDirectories();
          }
        } else {
          response = await getClientsDirectories();
        }

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const data = await response.json();

        setClientsDirectoriesData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getClientsDirectoriesData();
  }, [clientsDirectoriesDataLength, accountNum, accountName, directoryName]);

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
    maxPages = (Math.ceil((clientsDirectoriesDataLength / 50) - 1));
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
        variant="filled" />
      <TextField label={"Directory Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setDirectoryName(event.target.value);
      }}
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0 }}
        variant="filled" /> <br /><br />
      {
        clientsDirectoriesDataLength ?
          <table style={{ minWidth: '50%' }}>
            <tbody style={{ minWidth: '100%' }}>
              {(function () {
                let length: number = 50;
                let start: number = length * pageNum;
                let rows: any = [];
                for (let i = 0; i < length; i++) {
                  if (clientsDirectoriesData[i + start] == undefined) {
                    break;
                  } else {
                    rows.push(
                      <tr key={i} style={{ minWidth: '100%' }}>
                        <td style={{ paddingRight: '25px' }}>Client Number: {clientsDirectoriesData[i + start].ClientNumber}</td>
                        <td style={{ paddingRight: '25px' }}>Client: {clientsDirectoriesData[i + start].ClientName}</td>
                        <td style={{ paddingRight: '25px' }}>Directory: {clientsDirectoriesData[i + start].Name}</td>
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      }
      <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetClientsDirecoties;