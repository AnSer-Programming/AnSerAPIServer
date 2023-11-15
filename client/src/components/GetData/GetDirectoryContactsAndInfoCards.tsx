import React, { useState, useEffect } from 'react';
import { getClients, getDirectoryContactsAndInfoCards } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const GetDirectoryContactsAndInfoCards = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [directoryData, setData] = useState<any>({});
  const [columnHeaders, setHeaders] = useState<any[]>([]);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [accountNum, setAccountNum] = useState<number>(0);

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  
  useEffect(() => {
    const getClientsData = async() => {
      try {
        if(accountNum === 0) {
          const response = await getClients(); 
          let numbers:any[] = new Array; 
  
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
  
          let data = await response.json();
  
          setClientsData(data);
          for(let i = 0; i < data.length; i ++) {
            numbers[i] = `${data[i].ClientNumber}`;
          }
          // console.log(numbers);
          setAccountNumbers(numbers);
        } else {
          const response = await getDirectoryContactsAndInfoCards(accountNum);
  
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
  
          let data = await response.json();
          setData(data);
          setHeaders(Object.keys(data[0]));
        }
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength, accountNum]);

  if(!clientsDataLength) {
    <h2>LOADING...</h2>
  }

  const updateHandler = (input:any) => {
    setAccountNum(parseInt(input));
  }

  console.log(directoryData);

  return (
    <>
      <Autocomplete
        disablePortal 
        onChange={(event, newValue) => {
          if(newValue) { 
            setAccountNum(parseInt(newValue));
          }
        }}      
        options={accountNumbers}
        sx={{background: 'white', width: '50%', minWidth: '150px', zIndex: 0}}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{zIndex: 0}} />}
      /> <br />
      {
        directoryData == "Unavailable" ? <p>The directory is not yet in IS</p> :
          <table>
            <thead>
              <tr key={"columnHeaderRow"}>
                {(function(){
                    let rows:any = [];
                    for (let i = 0; i < columnHeaders.length; i++) {
                      if(columnHeaders[i] == undefined) {
                        break;
                      } else {
                        rows.push( 
                          <th style={{paddingRight: '25px'}}>{columnHeaders[i]}</th>
                        )
                      }
                    }
                  return rows;
                })()}
              </tr>
            </thead>
            <tbody>
              {(function(){
                let rows:any = [];
                for (let i = 0; i < directoryData.length; i++) {
                  if(directoryData[i] == undefined) {
                    break;
                  } else {
                    rows.push( 
                      <tr key={i} style={{minWidth: '100%'}}>
                        <td style={{paddingRight: '25px'}}>{directoryData[i][columnHeaders[0]]}</td>
                        <td style={{paddingRight: '25px'}}>{directoryData[i][columnHeaders[1]]}</td>
                        <td style={{paddingRight: '25px'}}>{directoryData[i][columnHeaders[2]]}</td>
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
          </tbody>
        </table>
      } <br />
    </>
  );
};

export default GetDirectoryContactsAndInfoCards;