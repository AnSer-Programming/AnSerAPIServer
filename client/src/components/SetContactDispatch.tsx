import React, { useState, useEffect } from 'react';
import { getContactDispatchAPI, setContactDispatchAPI } from '../utils/API';

const SetContactDispatch = (data) => {
  let updateContactDispatchData:JSON = JSON.parse('{"Data":[]}');
  const [contactDispatchData, setContactDispatchData] = useState({});
  const [firstDigit, setFirstDigit] = useState<number[]>([]);
  
    // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  let counter = 0;
    
  useEffect(() => {
    const getVesselData = async() => {
      try {
        const response = await getContactDispatchAPI();
  
        if (!response.ok) {
          throw new Error('something went wrong!');
        }
  
        const accounts = await response.json();
        setContactDispatchData(accounts);
  
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
  
    getVesselData();
  
  }, [contactDispatchDataLength]);
    
  if (!contactDispatchDataLength) {
    return <h2>LOADING...</h2>;
  }

  function tableBuilder(index) {
    if(data.groupNum === 0) {
      return (
        <tr style={{width: "100%"}}>
          <td style={{width: "25%"}}>Account Number: <input type="static" className={`accountNumber`} value={contactDispatchData[index].account} readOnly={true}></input></td>
          <td style={{width: "25%"}}>Status: <input type="text" placeholder={contactDispatchData[index].status} id={`status${index}`} className='status'></input></td>
          <td style={{width: "25%"}}>Account Type: <input type="text" placeholder={contactDispatchData[index].account_type} id={`type${index}`} className='type'></input></td>
          <td style={{width: "25%"}}>API: <input type="text" placeholder={contactDispatchData[index].api} id={`api${index}`} className='api'></input></td>
        </tr>
      )
    } else {
      if(Math.floor(firstDigit[index]) == data.groupNum) {
        return (
          <tr style={{width: "100%"}}>
            <td style={{width: "25%"}}>Account Number: <input type="static" className={`accountNumber`} value={contactDispatchData[index].account} readOnly={true}></input></td>
            <td style={{width: "25%"}}>Status: <input type="text" placeholder={contactDispatchData[index].status} id={`status${index}`} className='status'></input></td>
            <td style={{width: "25%"}}>Account Type: <input type="text" placeholder={contactDispatchData[index].account_type} id={`type${index}`} className='type'></input></td>
            <td style={{width: "25%"}}>API: <input type="text" placeholder={contactDispatchData[index].api} id={`api${index}`} className='api'></input></td>
          </tr>
        )
      }
    }
  }
  
  const handleVesselUpdate = async() => {
    try {
      const response = await setContactDispatchAPI(updateContactDispatchData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedContactDispatch = await response.json();
      setContactDispatchData(updatedContactDispatch);
    } catch (err) {
      console.error(`Update Error: ${err}`);
    }
  };

  const handleContactDispatchEdit = async() => {
    const elementsLength:number = document.getElementsByClassName("accountNumber").length;
    const accountNumber:any = document.getElementsByClassName("accountNumber");
    const status:any = document.getElementsByClassName("status");
    const type:any = document.getElementsByClassName("type");
    const api:any = document.getElementsByClassName("api");
    try {
      for(let i = 0; i < elementsLength; i++) {
        if(status[i].value != "") {
          if(type[i].value != "") {
            if(api[i].value != "") {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].value}`, "AccountType": `${type[i].value}`, 
                "API": `${api[i].value}`
              };
              counter++
            } else {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].value}`, 
                "AccountType": `${type[i].value}`, 
                "API": `${api[i].placeholder}`
              };
              counter++
            }
          } else {
            if(api[i].value != "") {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].value}`, 
                "AccountType": `${type[i].placeholder}`, 
                "API": `${api[i].value}`
              };
              counter++
            } else {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].value}`, 
                "AccountType": `${type[i].placeholder}`, 
                "API": `${api[i].placeholder}`
              };
              counter++
            }
          }
        } else {
          if(type[i].value != "") {
            if(api[i].value != "") {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].placeholder}`, 
                "AccountType": `${type[i].value}`, 
                "API": `${api[i].value}`
              };
              counter++
            } else {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].placeholder}`, 
                "AccountType": `${type[i].value}`, 
                "API": `${api[i].placeholder}`
              };
              counter++
            }
          } else {
            if(api[i].value != "") {
              updateContactDispatchData['Data'][counter] = {
                "Account": `${accountNumber[i].value}`, 
                "Status": `${status[i].placeholder}`, 
                "AccountType": `${type[i].placeholder}`, 
                "API": `${api[i].value}`
              };
              counter++
            } 
          }
        }
      }
    } catch(err) {
      console.error(`Packing error: ${err}`);
    }
    
    if(updateContactDispatchData['Data'][0] != null) {
      handleVesselUpdate();
    }
  }

  const saveBtn = {
    display: 'flex',
    position: 'fixed' as const,
    right: '1%',
    textAlign: 'center' as const,
    bottom: '5%',
    width: '12%',
  }

  const tableStyle = {
    marginLeft: '1%',
    width: '80%',
  }
  
  return (
    <>
      <button onClick={handleContactDispatchEdit} style={saveBtn}>Save All Edits</button>
      <table style={tableStyle}>
        <tbody>
          {Object.keys(contactDispatchData).map((index) => (tableBuilder(index)))} 
        </tbody>
      </table>
    </>
  );
};

export default SetContactDispatch;