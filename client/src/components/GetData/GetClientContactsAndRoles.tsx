import React, { useState, useEffect } from 'react';
import { getClientContactsAndRoles } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { toCSV } from '../Utility/DownloadHelper';

const GetClients = (data: any) => {
  const [clientsData, setClientsData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;

  useEffect(() => {
    const getClientsData = async () => {
      try {
        let response;
        setPageNum(0);
        if (accountNum) {
          response = await getClientContactsAndRoles(accountNum);

          let data = await response.json();

          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].role_list) {
                data[i].role_list = data[i].role_list.substring(0, data[i].role_list.lastIndexOf(','));
              }
            }
          }

          setClientsData(data);
          console.log(clientsData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength, accountNum, accountName]);

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
    maxPages = (Math.ceil((clientsDataLength / 50) - 1));
  }

  function downloadHandler() {
    let fileData: String = "Name,Role List\n";
    let fileName: string = `Account${accountNum}ContactsAndRoles.csv`;
    for (let i = 0; i < clientsData.length; i++) {
      if (clientsData[i].role_list) {
        fileData += `${clientsData[i].name.replaceAll(/,/g, "")},${clientsData[i].role_list.replaceAll(/,/g, " |")}\n`;
      } else {
        fileData += `${clientsData[i].name.replaceAll(/,/g, "")},None\n`;
      }
    }
    toCSV(fileData, fileName);
  }

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setAccountNum(parseInt(newValue));
          }
        }}
        options={data.accountNumbers}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{ zIndex: 0 }} />}
      /> <br />
      {maxPageSetter()}
      {
        maxPages > 1 ?
          <div>
            <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
            <Tooltip title="Enter Page Number">
              <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                pageChangeHandler("Select", parseInt(event.target.value) - 1);
              }}
                sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0 }}
                variant="filled" />
            </Tooltip>
            {
              clientsDataLength ?
                <button style={{ marginLeft: '.5%' }} onClick={downloadHandler} id="downloadCSV" value="download">
                  <i className="fas fa-download" />Click Here to Download
                </button> : <></>
            }<br /><br />
          </div> : <>
            {
              clientsDataLength ?
                <button style={{ marginLeft: '.5%' }} onClick={downloadHandler} id="downloadCSV" value="download">
                  <i className="fas fa-download" />Click Here to Download
                </button> : <></>
            }<br /><br /> </>
      } 
      {
        clientsDataLength ?
          <div>
            <h2 style={{ borderTop: 'solid 2px' }}>Account Number: {clientsData[0].ClientNumber}</h2>
            <h2 style={{ borderBottom: 'solid 2px' }}>Account Name: {clientsData[0].ClientName}</h2>
            <table style={{ borderBottom: 'solid 2px' }}>
              <tbody>
                {(function () {
                  let length: number = 50;
                  let start: number = length * pageNum;
                  let rows: any = [];
                  for (let i = 0; i < length; i++) {
                    if (clientsData[i + start] == undefined) {
                      break;
                    } else {
                      rows.push(
                        <tr key={i} style={{ minWidth: '100%' }}>
                          <td style={{ paddingRight: '25px' }}>Name: {clientsData[i + start].name}</td>
                          <td style={{ paddingRight: '25px' }}>Role List: {clientsData[i + start].role_list}</td>
                        </tr>
                      )
                    }
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </div> : <h2>LOADING...</h2>
      } <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetClients;