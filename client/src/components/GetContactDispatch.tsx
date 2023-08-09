import React, { useState, useEffect } from 'react';
import { getContactDispatchAPI } from '../utils/API';

const GetContactDispatch = (data) => {
  const [contactDispatchData, setContactDispatchData] = useState({});
  const [firstDigit, setFirstDigit] = useState<number[]>([]);
  // let firstDigit:number[] = new Array();

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  
  useEffect(() => {
    const getContactDispatchData = async() => {
      try {
        const response = await getContactDispatchAPI();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const accounts = await response.json();
        setContactDispatchData(accounts);
      } catch (err) {
        console.error(err);
      }
    };
  
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
    
    const interval = setInterval(() => {
      getContactDispatchData();
    }, 30000);
    getContactDispatchData();

    return () => clearInterval(interval);

  }, [contactDispatchDataLength]);
  
  if (!contactDispatchDataLength) {
    return <h2>LOADING...</h2>;
  } 

  function tableBuilder(index) {
    if(data.groupNum === 0) {
      return (
        <tr>
          <td style={tableField}>{contactDispatchData[index].account}</td>
          <td style={tableField}>{contactDispatchData[index].status}</td>
          <td style={tableField}>{contactDispatchData[index].account_type}</td>
          <td style={tableField}>{contactDispatchData[index].api}</td>
        </tr>
      )
    } else {
      if(Math.floor(firstDigit[index]) == data.groupNum) {
        return (
          <tr>
            <td style={tableField}>{contactDispatchData[index].account}</td>
            <td style={tableField}>{contactDispatchData[index].status}</td>
            <td style={tableField}>{contactDispatchData[index].account_type}</td>
            <td style={tableField}>{contactDispatchData[index].api}</td>
          </tr>
        )
      }
    }
  }

  const tableStyles = {
    marginLeft: '1%',
    width: '90%'
  }

  const tableField = {
    borderBottom: 'solid 1px',
    fontSize: '18px',
    width: '25%'
  }
  
  return (
    <>
      <div>
        <table style={tableStyles}>
          <thead>
            <tr style={{width:"100%"}}>
              <td style={tableField}>Account</td>
              <td style={tableField}>Status</td>
              <td style={tableField}>Account Type</td>
              <td style={tableField}>API</td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(contactDispatchData).map((index) => (tableBuilder(index)))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GetContactDispatch;