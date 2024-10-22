import React, { useState, useEffect } from 'react';
import { getDID, getDIDByAccountNum, getDIDByName, getDIDBySource } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const GetDID = () => {
  const [didData, setDIDData] = useState<any>({});
  const [accountNum, setAccountNum] = useState<number>();
  const [accountName, setAccountName] = useState<String>();
  const [sourceNum, setSourceNum] = useState<String>();
  const [activeDID, setActiveDID] = useState<boolean>(true);
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const didDataLength = Object.keys(didData).length;

  useEffect(() => {
    const getActiveDIDData = async () => {
      try {
        let response;
        setPageNum(0);
        if (accountNum) {
          response = await getDIDByAccountNum(accountNum);
          if (!response.ok) {
            response = await getDID();
          }
        } else if (accountName) {
          response = await getDIDByName(accountName);
          if (!response.ok) {
            response = await getDID();
          }
        } else if (sourceNum) {
          response = await getDIDBySource(sourceNum);
          if (!response.ok) {
            response = await getDID();
          }
        } else {
          response = await getDID();
        }

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const data = await response.json();

        setDIDData(data);

        setActiveDID(true);
      } catch (err) {
        console.error(err);
      }
    };

    getActiveDIDData();
  }, [didDataLength, accountNum, accountName, sourceNum]);

  function providerSelector(index: any) {
    if (didData.NotActiveDID[index].thinq) {
      return "ThinQ";
    } else if (didData.NotActiveDID[index].pulsar) {
      return "Pulsar";
    } else if (didData.NotActiveDID[index].nsight) {
      return "Nsight";
    } else if (didData.NotActiveDID[index].amtelco) {
      return "Amtelco";
    } else {
      return "Unlisted";
    }
  }

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

  const activeDIDHandler = () => {
    if (activeDID) {
      if (didData.ActiveDID) {
        maxPages = (Math.ceil((didData.ActiveDID.length / 50) - 1));
      }
    } else {
      if (didData.NotActiveDID) {
        maxPages = (Math.ceil((didData.NotActiveDID.length / 50) - 1));
      }
    }
  }

  return (
    <>
      {activeDIDHandler()}
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select", parseInt(event.target.value) - 1);
          activeDIDHandler();
        }}
          sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0 }}
          variant="filled" />
      </Tooltip>
      {
        activeDID ?
          <>
            <Tooltip title="Enter Full Account Number">
              <TextField label={"Account Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAccountNum(parseInt(event.target.value));
                activeDIDHandler();
              }}
                sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0 }}
                variant="filled" />
            </Tooltip>
            <Tooltip title="Enter Account Name">
              <TextField label={"Account Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAccountName(event.target.value);
                activeDIDHandler();
              }}
                sx={{ width: 250, background: 'white', marginLeft: '2.5%', zIndex: 0 }}
                variant="filled" />
            </Tooltip>
            <Tooltip title="Begin Entering DID Number">
              <TextField label={"DID Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSourceNum(event.target.value);
              }}
                sx={{ width: 250, background: 'white', marginLeft: '2.5%', zIndex: 0 }}
                variant="filled" />
            </Tooltip>
          </> : <></>
      }
      <FormControlLabel
        label="Toggle Active DID"
        labelPlacement="start"
        control={<Checkbox
          defaultChecked
          onChange={(event) => {
            if (event.target.checked) {
              setActiveDID(true);
            } else {
              setActiveDID(false);
            }
            activeDIDHandler();
          }} />}
        sx={{ borderColor: 'white', marginLeft: '2.5%', zIndex: 0 }} /><br /><br />
      {
        didDataLength ?
          <table>
            <tbody>
              {
                (function () {
                  let length: number = 50;
                  let start: number = length * pageNum;
                  let rows: any = [];

                  if (activeDID) {
                    for (let i = 0; i < length; i++) {
                      if (didData.ActiveDID[i + start] == undefined) {
                        break;
                      } else {
                        rows.push(
                          <tr key={i} style={{ minWidth: '100%' }}>
                            <td style={{ paddingRight: '25px' }}>Client Number: {didData.ActiveDID[i + start].ClientNumber}</td>
                            <td style={{ paddingRight: '25px' }}>Client Name: {didData.ActiveDID[i + start].ClientName}</td>
                            <td style={{ paddingRight: '25px' }}>DID Number: {didData.ActiveDID[i + start].Source}</td>
                            <td style={{ paddingRight: '25px' }}>Provider: {didData.ActiveDID[i + start].Provider}</td>
                          </tr>
                        )
                      }
                    }
                  } else {
                    for (let i = 0; i < length; i++) {
                      if (didData.NotActiveDID[i + start] == undefined) {
                        break;
                      } else {
                        rows.push(
                          <tr key={i} style={{ minWidth: '100%' }}>
                            <td style={{ paddingRight: '25px' }}>DID Number: {didData.NotActiveDID[i + start].phone_number}</td>
                            <td style={{ paddingRight: '25px' }}>Provider: {providerSelector(i + start)}</td>
                          </tr>
                        )
                      }
                    }
                  }
                  return rows;
                }
                )()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      }
      <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetDID;