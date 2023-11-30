import React, { useState, useEffect } from 'react';
import { getClients, getInfoPages } from '../../utils/GetDataAPI';
import { toPDF } from '../Utility/DownloadHelper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const GetInfoPages = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [infoPages, setData] = useState<any>({});
  const [maxPage, setMaxPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [accountNum, setAccountNum] = useState<number>(0);
  const [accountName, setAccountName] = useState<string>("");

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  const infoPagesLength = Object.keys(infoPages).length;

  let page:any;
  
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

          for(let i = 0; i < clientsDataLength; i++) {
            if(clientsData[i].ClientNumber == accountNum) {
              setAccountName(clientsData[i].ClientName);
            }
          }

          setData(data);
          setMaxPage((data.length-1));
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
    let fileData:string[] = [];
    let fileName:string = `${accountName} Info Pages`;
    for(let i = 0; i < infoPages.length; i++) {
      fileData[i] = infoPages[i].Info;
    }
    toPDF(fileData, fileName);
  }

  const pageHandler = (direction:string) => {
    if(direction === "previous") {
      if(currentPage === 0) {
        setCurrentPage(maxPage);
      } else {
        setCurrentPage(currentPage-1);
      }
    } else if (direction === "next") {
      if(currentPage === maxPage) {
        setCurrentPage(0);
      } else {
        setCurrentPage(currentPage+1);
      }
    }
  }

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
      infoPagesLength ?  
        <div>
          <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage} <button onClick={() => pageHandler("next")}>Next</button> <br /><br />
          <button onClick={downloadHandler} id="downloadCSV" value="download">
            <i className="fas fa-download"/>Click Here to Download
          </button> <br /><br />
          <div style={{backgroundColor: 'white', color: 'black'}} className="content" dangerouslySetInnerHTML={{__html: (infoPages[currentPage].Info)}}>
          </div>
          <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage} <button onClick={() => pageHandler("next")}>Next</button> 
        </div>:
        <h2>Select an Account to continue</h2>
      }
    </>
  );
};

export default GetInfoPages;