import React, { useState, useEffect } from 'react';
import { getClientsDirectories, getClientsDirectoriesByNum, getClientsDirectoriesByName, getClientsDirectoriesByDirectory } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';

const GetClientsDirecoties = () => {
  const [clientsDirectoriesData, setClientsDirectoriesData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [directoryName, setDirectoryName] = useState<String>();

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDirectoriesDataLength = Object.keys(clientsDirectoriesData).length;

  useEffect(() => {
    const getClientsDirectoriesData = async() => {
      try {
        let response;
        if(accountNum) {
          response = await getClientsDirectoriesByNum(accountNum);
          if (!response.ok) {
            response = await getClientsDirectories();
          }
        } else if(accountName) {
          response = await getClientsDirectoriesByName(accountName);
          if (!response.ok) {
            response = await getClientsDirectories();
          }
        } else if(directoryName) {
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

  return (
    <>
      <TextField label={"Account Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNum(parseInt(event.target.value));
      }} 
      sx={{ width: 250, background: 'white', zIndex: 0}}
      variant="filled" />
      <TextField label={"Account Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(event.target.value);
      }} 
      sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
      variant="filled" />
      <TextField label={"Directory Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setDirectoryName(event.target.value);
      }} 
      sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
      variant="filled" /> <br /><br />
      {
        clientsDirectoriesDataLength ? 
          <table>
            <tbody>
              {Object.keys(clientsDirectoriesData).map((index) => (
                <tr key={`row${index}`}>
                  <td style={{paddingRight: '25px'}}>Client Number: {clientsDirectoriesData[index].ClientNumber}</td>
                  <td style={{paddingRight: '25px'}}>Client: {clientsDirectoriesData[index].ClientName}</td>
                  <td style={{paddingRight: '25px'}}>Directory: {clientsDirectoriesData[index].Name}</td>
                </tr>
              ))}
            </tbody>
          </table> : <h2>LOADING...</h2>
      }
    </>
  );
};

export default GetClientsDirecoties;