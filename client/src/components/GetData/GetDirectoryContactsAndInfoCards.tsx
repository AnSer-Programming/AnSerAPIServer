import React, { useState, useEffect } from 'react';
import { getClients, getDirectoryContactsAndInfoCards } from '../../utils/GetDataAPI';
import { toCSV } from '../Utility/DownloadHelper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const GetDirectoryContactsAndInfoCards = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [directoryData, setData] = useState<any>({});
  const [columnHeaders, setHeaders] = useState<any[]>([]);
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [accountNum, setAccountNum] = useState<number>(0);
  const [accountName, setAccountName] = useState<string>("");

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  const columnHeadersLength = Object.keys(columnHeaders).length;

  let index:number = 0;
  let maxProperties:number = 0;
  let isDone:boolean = false;
  let counter:number = 0;
  
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

          for(let i = 0; i < clientsDataLength; i++) {
            if(clientsData[i].ClientNumber == accountNum) {
              setAccountName(clientsData[i].ClientName);
            }
          }

          for(let i = 0; i < data.length; i ++) {
            numbers[i] = `${data[i].ClientNumber}`;
          }
          setAccountNumbers(numbers);
        } else {
          setHeaders([null]);
          const response = await getDirectoryContactsAndInfoCards(accountNum);

          for(let i = 0; i < clientsDataLength; i++) {
            if(clientsData[i].ClientNumber == accountNum) {
              setAccountName(clientsData[i].ClientName);
            }
          }
  
          if (!response.ok) {
            throw new Error('something went wrong!');
          }
  
          let data = await response.json();

          for(let i = 0; i < data.length; i++) {
            if(Object.keys(data[i]).length > maxProperties) {
              index = i;
              maxProperties = Object.keys(data[i]).length;
            }
          }

          let placeHolder:string[] = Object.keys(data[index]);
          let valueHolder:string;
          for(let i = 0; i < placeHolder.length; i++) {
            if(placeHolder[i] == 'listID') {
              placeHolder.splice(i, 1);
            }
            if(placeHolder[i] == "InfoCard" && i != placeHolder.length-1) {
              placeHolder[i] = placeHolder[i+1];
              placeHolder[i+1] = "InfoCard";
            }
            if(placeHolder[i] == "Name" && i != 0) {
              for(let x = i; x > 0; x--) {
                placeHolder[x] = placeHolder[x-1];
              }
              placeHolder[0] = "Name";
            }
            if(placeHolder[i].includes("Account") && i != 1) {
              valueHolder = placeHolder[i]
              for(let x = i; x > 1; x--) {
                placeHolder[x] = placeHolder[x-1];
              }
              placeHolder[1] = valueHolder;
            }
          }
          setHeaders(placeHolder);

          for(let x = 0; x < data.length; x++) {
            for(let y = 0; y < data.length; y++) {
              if(!data[x][columnHeaders[y]]) {
                data[x][columnHeaders[y]] = '';
              } else {
                data[x][columnHeaders[y]] = data[x][columnHeaders[y]].trim();
              }
            }
          }

          let objHolder:any;
          while(!isDone) {
            for(let x = 0; x < data.length-1; x++) {
              if(data[x][columnHeaders[0]][0] > data[x+1][columnHeaders[0]][0]) {
                objHolder = await data[x];
                data[x] = await data[x+1];
                data[x+1] = await objHolder;
              } else if(data[x][columnHeaders[0]][0] == data[x+1][columnHeaders[0]][0]) {
                for(let y = 1; y < data[x][columnHeaders[0]].length; y++) {
                  if(data[x][columnHeaders[0]][y] > data[x+1][columnHeaders[0]][y]) {
                    objHolder = await data[x];
                    data[x] = await data[x+1];
                    data[x+1] = await objHolder;
                    break;
                  } else if(data[x][columnHeaders[0]][y] < data[x+1][columnHeaders[0]][y]) {
                    break;
                  }
                }
              }
            }
            counter++;
            if(counter > data.length) {
              isDone = true;
            }
          }

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

  const headerHandler = () => {
    if(!columnHeadersLength) {
      return (<h2>Select An Account</h2>);
    } else if(columnHeadersLength > 1) {
      return(
        <button onClick={downloadHandler} id="downloadCSV" value="download">
          <i className="fas fa-download"/>Click Here to Download
        </button>
      );
    } else if(columnHeaders[0] < 1) {
      return(<p>No directory in IS</p>)
    }
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="secondary" disableShrink />
      </Box>
    );
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
      {headerHandler()} <br /> <br />
      {
        directoryData == "Unavailable" ? <p>The directory is not yet in IS</p> :
          <div style={{overflow: "auto", height: '75vh'}}>
            <p><strong>Note:</strong> find and delete the word undefined from the CSV document. There is currently a bug that is causing this word to populate in some fields. If the word "undefined" pops up there is no data for that field.</p>
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
                                <td style={{paddingRight: '25px', minWidth: '250px'}}>{directoryData[x][columnHeaders[y]]}</td>
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
        </div>
      }
    </>
  );
};

export default GetDirectoryContactsAndInfoCards;