import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
import { getContactDispatchAPI } from '../utils/API';

const GetContactDispatch = ({optionNum, setOptions}) => {
  const [contactDispatchData, setContactDispatchData] = useState({});
  const [firstDigit, setFirstDigit] = useState<number[]>([]);
  const modifier = Math.pow(10, optionNum) -1;
  // let firstDigit:number[] = new Array();

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  const pages = Math.ceil(contactDispatchDataLength / 100);
  console.log(pages);
  
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
    
    const interval = setInterval(() => {
      getContactDispatchData();
    }, 30000);
    getContactDispatchData();

    return () => clearInterval(interval);

  }, [contactDispatchDataLength]);
  
  if (!contactDispatchDataLength) {
    return <h2>LOADING...</h2>;
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
            {(function (len) {
              let rows:any = [];
              for (let i = 0; i < len; i++) {
                rows.push(
                  <tr>
                    <td style={tableField}>{contactDispatchData[i+modifier].account}</td>
                    <td style={tableField}>{contactDispatchData[i+modifier].status}</td>
                    <td style={tableField}>{contactDispatchData[i+modifier].account_type}</td>
                    <td style={tableField}>{contactDispatchData[i+modifier].api}</td>
                  </tr>)
              }
              return rows;
            })(100)}
          </tbody>
        </table>
        {}
      </div>
    </>
  );
};

export default GetContactDispatch;