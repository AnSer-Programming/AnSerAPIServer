import React, { useState, useEffect } from 'react';
import { getClients, getClientsByNum, getClientsByName } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetClients = () => {
  const [clientsData, setClientsData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages:number = 0;

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

  const pageChangeHandler = (direction:String, input:number) => {
    if(direction==="Select"){
      if(input > maxPages) {
        setPageNum(maxPages);
      } else if(input < 0 || !input) {
        setPageNum(0);
      } else if(input) {
        setPageNum(input);
      }
    } else if(direction === 'Next') {
      if(pageNum < maxPages) {
        setPageNum(pageNum+1);
      }
    } else {
      if(pageNum > 0) {
        setPageNum(pageNum-1);
      }
    }
  }

  const maxPageSetter = () => {
    maxPages = (Math.ceil((clientsDataLength/50)-1));
  }
  
  if (!clientsDataLength) {
    return <h2>LOADING...</h2>;
  } else {
    maxPageSetter();
  }

  return (
    <>
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select",parseInt(event.target.value)-1);
        }} 
        sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0}}
        variant="filled" />
      </Tooltip>
      <TextField label={"Account Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAccountNum(parseInt(event.target.value));
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0}}
        variant="filled" />
      <TextField label={"Account Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAccountName(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0}}
        variant="filled" /> <br /><br />
      <table>
        <tbody>
          {(function(){   
              let length:number = 50;
              let start:number = length * pageNum;
              let rows:any = [];
              for (let i = 0; i < length; i++) {
                if(clientsData[i+start] == undefined) {
                  break;
                } else {
                  rows.push( 
                    <tr key={i} style={{minWidth: '100%'}}>
                      <td style={{paddingRight: '25px'}}>Client Number: {clientsData[i+start].ClientNumber}</td>
                      <td style={{paddingRight: '25px'}}>Client: {clientsData[i+start].ClientName}</td>
                      <td style={{paddingRight: '25px'}}>Start Date: {(
                        function(){
                          let dateTime = clientsData[i+start].Stamp.split(" ");
                          for(let x = 0; x < dateTime.length; x++) {
                            if(dateTime[x] === "") {
                              for(let y = x; y < dateTime.length ; y++) {
                                dateTime[y] = dateTime[y+1];
                              }
                            }
                          }
                          console.log(dateTime);
                          return `${dateTime[0]} ${dateTime[1]} ${dateTime[2]}`
                        }())}
                      </td>
                    </tr>
                  )
                }
              }
              return rows;
            })()}
        </tbody>
      </table>
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetClients;