import React, { useState, useEffect } from 'react';
import { getContactsDirectories, getContactsDirectoriesByPersonName, getContactsDirectoriesByDirectory } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetContactsDirectories = () => {
  const [contactsDirectoriesData, setContactsDirectories] = useState<any>({});
  const [personName, setPersonName] = useState<String>();
  const [directoryName, setDirectoryName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const contactsDirectoriesDataLength = Object.keys(contactsDirectoriesData).length;

  useEffect(() => {
    const getClientsDirectoriesData = async () => {
      try {
        let response;
        setPageNum(0);
        if (personName) {
          response = await getContactsDirectoriesByPersonName(personName);
          if (!response.ok) {
            response = await getContactsDirectories();
          }
        } else if (directoryName) {
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

  const pageChangeHandler = (direction: String, input: number) => {
    if (direction === "Select") {
      if (input > maxPages) {
        setPageNum(maxPages);
      } else if (input < 0 || !input) {
        setPageNum(0);
      } else if (input) {
        setPageNum(input);
      }
    } else if (direction === 'Next') {
      if (pageNum < maxPages) {
        setPageNum(pageNum + 1);
      }
    } else {
      if (pageNum > 0) {
        setPageNum(pageNum - 1);
      }
    }
  }

  const maxPageSetter = () => {
    maxPages = (Math.ceil((contactsDirectoriesDataLength / 50) - 1));
  }

  const exceptionString = (data: any) => {
    let formattedData: string = `No Exceptions`;
    console.log(data);
    if (data.Exceptions) {
      if (data.Exceptions.length > 1 && data.Exceptions != "null") {
        console.log(data.Exceptions);
        for (let i = 0; i < data.Exceptions.length; i++) {
          console.log(data.Exceptions[i]);
          if (i === 0) {
            formattedData = `Status: ${data.Exceptions[i].cmnStatusException.Status.Status} | Starts: ${data.Exceptions[i].cmnStatusException.Start} | Ends: ${data.Exceptions[i].cmnStatusException.End} | Days: ${data.Exceptions[i].cmnStatusException.Days}`;
          } else {
            formattedData += `\nStatus: ${data.Exceptions[i].cmnStatusException.Status.Status} | Starts: ${data.Exceptions[i].cmnStatusException.Start} | Ends: ${data.Exceptions[i].cmnStatusException.End} | Days: ${data.Exceptions[i].cmnStatusException.Days}`;
          }

        }
      } else {
        formattedData = `No Exceptions`;
      }
    } else {
      formattedData = `No Exceptions`;
    }
    return formattedData;
  }

  return (
    <>
      {maxPageSetter()}
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select", parseInt(event.target.value) - 1);
        }}
          sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0 }}
          variant="filled" />
      </Tooltip>
      <TextField label={"Contact Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setPersonName(event.target.value);
      }}
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0 }}
        variant="filled" />
      <TextField label={"Directory Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setDirectoryName(event.target.value);
      }}
        sx={{ width: 250, background: 'white', marginLeft: '5%', zIndex: 0 }}
        variant="filled" /> <br /><br />
      {
        contactsDirectoriesDataLength ?
          <table style={{ minWidth: '50%', width: '90%', tableLayout: 'fixed' }}>
            <thead>
              <tr key={"HeaderRow"} style={{ borderBottom: '1px solid', fontSize: '24px' }}>
                <td style={{ marginRight: '5%', width: '15%' }}>Directory Name</td>
                <td style={{ marginRight: '5%', width: '15%' }}>Contact Name</td>
                <td style={{ marginRight: '5%', width: '15%' }}>Status</td>
                <td style={{ marginRight: '5%' }}>Scheduled Status Changes</td>
              </tr>
            </thead>
            <tbody style={{ minWidth: '100%' }}>
              {(function () {
                let length: number = 50;
                let start: number = length * pageNum;
                let rows: any = [];
                for (let i = 0; i < length; i++) {
                  if (contactsDirectoriesData[i + start] == undefined) {
                    break;
                  } else {
                    rows.push(
                      <tr key={i} style={{ minWidth: '100%' }}>
                        <td style={{ marginRight: '5%' }}>{contactsDirectoriesData[i + start].Name.trim()}</td>
                        <td style={{ marginRight: '5%' }}>{contactsDirectoriesData[i + start].Field.trim()}</td>
                        <td style={{ marginRight: '5%' }}>{contactsDirectoriesData[i + start].Status.Default ? contactsDirectoriesData[i + start].Status.Default.Status.trim() : `No Status Set`}</td>
                        <td style={{ whiteSpace: 'pre-wrap', marginRight: '5%' }}>{exceptionString(contactsDirectoriesData[i + start].Status)}</td>
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
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetContactsDirectories;