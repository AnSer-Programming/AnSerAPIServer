import React, { useState, useEffect } from 'react';
import { getActiveDID, getActiveDIDByAccountNum, getActiveDIDByName, getActiveDIDBySource } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetActiveDID = () => {
  const [clientsDirectoriesData, setClientsDirectoriesData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [sourceNum, setSourceNum] = useState<String>();

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDirectoriesDataLength = Object.keys(clientsDirectoriesData).length;

  useEffect(() => {
    const getClientsDirectoriesData = async() => {
      try {
        let response;
        if(accountNum) {
          response = await getActiveDIDByAccountNum(accountNum);
          if (!response.ok) {
            response = await getActiveDID();
          }
        } else if(accountName) {
          response = await getActiveDIDByName(accountName);
          if (!response.ok) {
            response = await getActiveDID();
          }
        } else if(sourceNum) {
          response = await getActiveDIDBySource(sourceNum);
          if (!response.ok) {
            response = await getActiveDID();
          }
        } else {
          response = await getActiveDID();          
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
  }, [clientsDirectoriesDataLength, accountNum, accountName, sourceNum]);

  return (
    <>
      <p>Only Accounts With DID's Will Appear</p>
      <Tooltip title="Enter Full Account Number">
        <TextField label={"Account Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAccountNum(parseInt(event.target.value));
        }} 
        sx={{ width: 250, background: 'white', zIndex: 0}}
        variant="filled" />
      </Tooltip>
      <Tooltip title="Enter Account Name">
        <TextField label={"Account Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAccountName(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
        variant="filled" />
      </Tooltip>
      <Tooltip title="Begin Entering DID Number">
        <TextField label={"DID Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSourceNum(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
        variant="filled" />
      </Tooltip> <br /><br />
      {
        clientsDirectoriesDataLength ? 
          <table>
            <tbody>
              {Object.keys(clientsDirectoriesData).map((index) => (
                <tr key={`row${index}`}>
                  <td style={{paddingRight: '25px'}}>Client Number: {clientsDirectoriesData[index].ClientNumber}</td>
                  <td style={{paddingRight: '25px'}}>Client Name: {clientsDirectoriesData[index].ClientName}</td>
                  <td style={{paddingRight: '25px'}}>DID Number: {clientsDirectoriesData[index].Source}</td>
                </tr>
              ))}
            </tbody>
          </table> : <div><h2>LOADING...</h2><p>This Page Will Continue Loading Even If The Account Number/DID Source Doesn't Exist</p></div>
      }
    </>
  );
};

export default GetActiveDID;