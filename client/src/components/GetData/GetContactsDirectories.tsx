import React, { useState, useEffect } from 'react';
import { getContactsDirectories, getContactsDirectoriesByPersonName, getContactsDirectoriesByDirectory } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetContactsDirectories = () => {
  const [contactsDirectoriesData, setContactsDirectories] = useState<any>({});
  const [personName, setPersonName] = useState<String>();
  const [directoryName, setDirectoryName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages:number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const contactsDirectoriesDataLength = Object.keys(contactsDirectoriesData).length;

  useEffect(() => {
    const getClientsDirectoriesData = async() => {
      try {
        let response;
        setPageNum(0);
        if(personName) {
          response = await getContactsDirectoriesByPersonName(personName);
          if (!response.ok) {
            response = await getContactsDirectories();
          }
        } else if(directoryName) {
          response = await getContactsDirectoriesByDirectory(directoryName);
          if (!response.ok) {
            response = await getContactsDirectories();
          }
        } else {
          response = await getContactsDirectories();          
        }

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const data = await response.json();

        setContactsDirectories(data);
      } catch (err) {
        console.error(`useEffect Error: ${err}`);
      }
    };

    getClientsDirectoriesData();
  }, [contactsDirectoriesDataLength, personName, directoryName]);

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
    maxPages = (Math.ceil((contactsDirectoriesDataLength/50)-1));
  }

  return (
    <>
      {maxPageSetter()}
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            pageChangeHandler("Select",parseInt(event.target.value)-1);
          }} 
          sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0}}
          variant="filled" />
      </Tooltip>
      <TextField label={"Contact Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPersonName(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
        variant="filled" />
      <TextField label={"Directory Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDirectoryName(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0}}
        variant="filled" /> <br /><br />
      {
        contactsDirectoriesDataLength ? 
          <table style={{minWidth: '50%'}}>
            <tbody style={{minWidth: '100%'}}>
              {(function(){
                let length:number = 50;
                let start:number = length * pageNum;
                let rows:any = [];
                for (let i = 0; i < length; i++) {
                  if(contactsDirectoriesData[i+start] == undefined) {
                    break;
                  } else {
                    rows.push( 
                      <tr key={i} style={{minWidth: '100%'}}>
                        <td style={{marginRight: '5%'}}>{contactsDirectoriesData[i+start].Name}</td>
                        <td>{contactsDirectoriesData[i+start].Field}</td>
                      </tr>
                    )
                  }
                }
                return rows;
              })()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      }
      <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetContactsDirectories;