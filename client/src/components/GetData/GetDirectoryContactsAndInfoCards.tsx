import React, { useState, useEffect } from 'react';
import { getClients, getDirectoryContactsAndInfoCards } from '../../utils/GetDataAPI';
import { toCSV } from '../Utility/DownloadHelper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const GetDirectoryContactsAndInfoCards = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [directoryData, setData] = useState<any>({});
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
  
          setClientsData(data);
          for(let i = 0; i < data.length; i ++) {
            numbers[i] = `${data[i].ClientNumber}`;
          }
          setAccountNumbers(numbers);
        } else {
          const response = await getDirectoryContactsAndInfoCards(accountNum);
  
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
  
          let data = await response.json();
          let placeHolder:string[] = Object.keys(data[0]);
          setData(data);
          for(let i = 0; i < placeHolder.length; i++) {
            if(placeHolder[i] == 'listID') {
              placeHolder.splice(i, 1);
            }
            if(placeHolder[i] == "InfoCard" && i != placeHolder.length-1) {
              placeHolder[i] = placeHolder[i+1];
              placeHolder[i+1] = "InfoCard";
            }
          }

          for(let i = 0; i < clientsDataLength; i++) {
            if(clientsData[i].ClientNumber == accountNum) {
              setAccountName(clientsData[i].ClientName);
            }
          }
          setHeaders(placeHolder);
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
    let fileData:String = "";
    let fileName:string = `${accountName} Directory Information.csv`;
    for(let i = 0; i < columnHeaders.length; i++) {
        if(i===0) {
            fileData = columnHeaders[i];
        } else {
            fileData +=`,${columnHeaders[i]}`;
        }
    }
    for(let x = 0; x < directoryData.length; x++) {
      for(let y = 0; y < columnHeaders.length; y++) {
        if(y === 0) {
          fileData +=`\n"${directoryData[x][columnHeaders[y]]}"`;
        } else {
          fileData +=`,"${directoryData[x][columnHeaders[y]]}"`;
        }
      }
    }
    toCSV(fileData, fileName);
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
                for (let x = 0; x < directoryData.length; x++) {
                  if(directoryData[x] == undefined) {
                    break;
                  } else {
                    rows.push( 
                      <tr key={x} style={{minWidth: '100%', borderBottom: '1px solid'}}>
                        {(function(){
                          let elements:any = [];
                          for(let y = 0; y < columnHeaders.length; y++) {
                            elements.push(
                              <td style={{paddingRight: '25px'}}>{directoryData[x][columnHeaders[y]]}</td>
                            )
                          }
                          return elements;
                        })()}
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
          </tbody>
        </table>
      } <br />
      
      <button onClick={downloadHandler} id="downloadCSV" value="download">
        <i className="fas fa-download"/>Click Here to Download
      </button>
    </>
  );
};

export default GetDirectoryContactsAndInfoCards;