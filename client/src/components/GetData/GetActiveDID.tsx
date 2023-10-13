import React, { useState, useEffect } from 'react';
import { getActiveDID, getActiveDIDByAccountNum, getActiveDIDByName, getActiveDIDBySource } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetActiveDID = () => {
  const [activeDIDData, setActiveDIDData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [sourceNum, setSourceNum] = useState<String>();

  // use this to determine if `useEffect()` hook needs to run again
  const activeDIDDataLength = Object.keys(activeDIDData).length;

  useEffect(() => {
    const getActiveDIDData = async() => {
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

        setActiveDIDData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getActiveDIDData();
  }, [activeDIDDataLength, accountNum, accountName, sourceNum]);

  console.log(activeDIDData)

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
        activeDIDDataLength ? 
          <table>
            <tbody>
              {Object.keys(activeDIDData).map((index) => (
                <tr key={`row${index}`}>
                  <td style={{paddingRight: '25px'}}>Client Number: {activeDIDData[index].ClientNumber}</td>
                  <td style={{paddingRight: '25px'}}>Client Name: {activeDIDData[index].ClientName}</td>
                  <td style={{paddingRight: '25px'}}>DID Number: {activeDIDData[index].Source}</td>
                  <td style={{paddingRight: '25px'}}>Provider: {activeDIDData[index].Provider}</td>
                </tr>
              ))}
            </tbody>
          </table> : <div><h2>LOADING...</h2><p>This Page Will Continue Loading Even If The Account Number/DID Source Doesn't Exist</p></div>
      }
    </>
  );
};

export default GetActiveDID;