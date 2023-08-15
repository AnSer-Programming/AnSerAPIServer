import React from 'react';
import { useState, useEffect } from 'react';
import { getContactDispatchAPI, setContactDispatchAPI } from '../utils/API';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetContactDispatch = ({optionNum, setOptions}) => {
  // let updateContactDispatchData:JSON = JSON.parse('{"Data":[]}');
  const [contactDispatchData, setContactDispatchData] = useState({});
  const [statusOptions, setStatus] = useState<any[]>([]);
  const [firstDigit, setFirstDigit] = useState<number[]>([]);
  
    // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  console.log(contactDispatchData);
    
  useEffect(() => {
    const getContactDispatchData = async() => {
      try {
        const response = await getContactDispatchAPI();
  
        if (!response.ok) {
          throw new Error('something went wrong!');
        }
  
        const accounts = await response.json();
        setContactDispatchData(accounts);
        setStatus(["Contact Dispatch", "Delivery Screen", "System Script", "Agent Account", "Client Off Service", "Cue"]);

        async function getFirstDigits() {
          let firstDigitArray:number[] = new Array();
          for(let i = 0; i < Object.keys(contactDispatchData).length; i ++) {
            let checker = contactDispatchData[i].account / 10;
            while(checker >= 1) {
              checker = checker / 10;
            }
            firstDigitArray[i] = checker * 10;
          }
          setFirstDigit(firstDigitArray)
        }
      
        getFirstDigits();
      } catch (err) {
        console.error(err);
      }
    };
  
    getContactDispatchData();
  
  }, [contactDispatchDataLength]);
    
  if (!contactDispatchDataLength) {
    return <h2>LOADING...</h2>;
  }
  // const categoryOptions = ["HVAC"];

  function tableBuilder(index) {
    try {
      // if(firstDigit[index] === groupNum )
      return (
        <tr style={{width: "100%"}}>
          {/* <td style={{width: "25%"}}>
            Account Number: <br /> <input type="static" className={`accountNumber`} value={contactDispatchData[index].account} readOnly={true}></input>
          </td>

          <td style={{width: "25%"}}>Status: <Autocomplete
              id={"statusInput"}
              disablePortal
              onChange={(event, newInputValue) => {
                handleContactDispatchEdit(index, newInputValue, "Person");
              }}
              options={statusOptions}
              sx={{ background: 'white'}}
              renderInput={(params) => <TextField {...params} label={contactDispatchData[index].status} />}
            />
          </td> */}
          <td style={{width: "25%"}}>
            Account Number: <br />
            <TextField label={contactDispatchData[index].account}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {console.log("no change")}}
              sx={{background: 'white'}}
              InputProps={{
                readOnly: true,
              }} />
          </td>
          <td style={{width: "25%"}}>
            Status: <Autocomplete
              disablePortal
              onChange={(event, newInputValue) => {
                handleContactDispatchEdit(index, newInputValue, "Person");
              }}
              options={statusOptions}
              sx={{background: 'white'}}
              renderInput={(params) => <TextField {...params} value={contactDispatchData[index].status} />}
            /> 
          </td>
        </tr>
      )
    } catch(err) {
      console.error(err);
    } 
  }
  
  // const handleContactUpdate = async() => {
  //   try {
  //     const response = await setContactDispatchAPI(updateContactDispatchData);

  //     if (!response.ok) {
  //       throw new Error('something went wrong!');
  //     }

  //     const updatedContactDispatch = await response.json();
  //     setContactDispatchData(updatedContactDispatch);
  //   } catch (err) {
  //     console.error(`Update Error: ${err}`);
  //   }
  // };

  const handleContactDispatchEdit = async(index, input, field) => {
    console.log(`${index} ${input} ${field}`);
  }

  // const saveBtn = {
  //   display: 'flex',
  //   position: 'fixed' as const,
  //   right: '1%',
  //   textAlign: 'center' as const,
  //   bottom: '5%',
  //   width: '12%',
  // }

  const tableStyle = {
    marginLeft: '1%',
    width: '80%',
  }
  
  return (
    <>
      {/* <button onClick={handleContactDispatchEdit} style={saveBtn}>Save All Edits</button> */}
      <div>
        <p>Under Construction!</p>
        {/* <table style={tableStyle}>
          <tbody>
            {Object.keys(contactDispatchData).map((index) => (tableBuilder(index)))} 
          </tbody>
        </table> */}
      </div>
    </>
  );
};

export default SetContactDispatch;


    // const elementsLength:number = document.getElementsByClassName("accountNumber").length;
    // const accountNumber:any = document.getElementsByClassName("accountNumber");
    // const status:any = document.getElementsByClassName("status");
    // const type:any = document.getElementsByClassName("type");
    // const api:any = document.getElementsByClassName("api");
    // try {
      // for(let i = 0; i < elementsLength; i++) {
      //   if(status[i].value != "") {
      //     if(type[i].value != "") {
      //       if(api[i].value != "") {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].value}`, "AccountType": `${type[i].value}`, 
      //           "API": `${api[i].value}`
      //         };
      //         counter++
      //       } else {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].value}`, 
      //           "AccountType": `${type[i].value}`, 
      //           "API": `${api[i].placeholder}`
      //         };
      //         counter++
      //       }
      //     } else {
      //       if(api[i].value != "") {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].value}`, 
      //           "AccountType": `${type[i].placeholder}`, 
      //           "API": `${api[i].value}`
      //         };
      //         counter++
      //       } else {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].value}`, 
      //           "AccountType": `${type[i].placeholder}`, 
      //           "API": `${api[i].placeholder}`
      //         };
      //         counter++
      //       }
      //     }
      //   } else {
      //     if(type[i].value != "") {
      //       if(api[i].value != "") {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].placeholder}`, 
      //           "AccountType": `${type[i].value}`, 
      //           "API": `${api[i].value}`
      //         };
      //         counter++
      //       } else {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].placeholder}`, 
      //           "AccountType": `${type[i].value}`, 
      //           "API": `${api[i].placeholder}`
      //         };
      //         counter++
      //       }
      //     } else {
      //       if(api[i].value != "") {
      //         updateContactDispatchData['Data'][counter] = {
      //           "Account": `${accountNumber[i].value}`, 
      //           "Status": `${status[i].placeholder}`, 
      //           "AccountType": `${type[i].placeholder}`, 
      //           "API": `${api[i].value}`
      //         };
      //         counter++
      //       } 
      //     }
      //   }
      // }
    // } catch(err) {
    //   console.error(`Packing error: ${err}`);
    // }
    
    // if(updateContactDispatchData['Data'][0] != null) {
    //   handleContactUpdate();
    // }