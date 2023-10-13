import React, { useState, useEffect } from 'react';
import { getClients, getClientsByNum, getClientsByName } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';

const GetClients = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  
  useEffect(() => {
    const getClientsData = async() => {
      try {
        let response;
        setPageNum(0);
        if(accountNum) {
          response = await getClientsByNum(accountNum);
          if (!response.ok) {
            response = await getClients();
          }
        } else if(accountName) {
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
  
  if (!clientsDataLength) {
    return <h2>LOADING...</h2>;
  }

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
      variant="filled" /> <br /><br />
      <table>
        <tbody>
          {Object.keys(clientsData).map((index) => (
            <tr key={`row${index}`}>
              <td style={{paddingRight: '25px'}}>Client Number: {clientsData[index].ClientNumber}</td>
              <td style={{paddingRight: '25px'}}>Client: {clientsData[index].ClientName}</td>
            </tr>
          ))} 
        </tbody>
      </table>
    </>
  );
};

export default GetClients;