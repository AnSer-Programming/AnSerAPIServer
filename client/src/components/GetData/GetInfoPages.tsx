import React, { useState, useEffect } from 'react';
import { getClients, getInfoPages } from '../../utils/GetDataAPI';
import { toCSV } from '../Utility/DownloadHelper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const GetInfoPages = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [infoPages, setData] = useState<any>({});
  const [columnHeaders, setHeaders] = useState<any[]>([]);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [accountNum, setAccountNum] = useState<number>(0);
  const [accountName, setAccountName] = useState<string>("");

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
  
          for(let i = 0; i < data.length; i ++) {
            numbers[i] = `${data[i].ClientNumber}`;
          }

          setClientsData(data);
          setAccountNumbers(numbers);
        } else {
          console.log(accountNum);
          const response = await getInfoPages(accountNum); 
  
          if (!response.ok) {
            throw new Error('something went wrong!'); 
          }
  
          let data = await response.json();

          // console.log(data);

          setData(data);
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

  function downloadHandler() {
    // let fileData:String = "";
    // let fileName:string = `${accountName} Directory Information.csv`;
    // for(let i = 0; i < columnHeaders.length; i++) {
    //     if(i===0) {
    //         fileData = columnHeaders[i];
    //     } else {
    //         fileData +=`,${columnHeaders[i]}`;
    //     }
    // }
    // for(let x = 0; x < directoryData.length; x++) {
    //   for(let y = 0; y < columnHeaders.length; y++) {
    //     if(y === 0) {
    //       fileData +=`\n"${directoryData[x][columnHeaders[y]]}"`;
    //     } else {
    //       fileData +=`,"${directoryData[x][columnHeaders[y]]}"`;
    //     }
    //   }
    // }
    // toCSV(fileData, fileName);
  }

  console.log(infoPages[0]);

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
      <div style={{backgroundColor: 'white', color: 'black'}} className="content" dangerouslySetInnerHTML={{__html: (infoPages[2].Info)}}></div>
    </>
  );
};

export default GetInfoPages;