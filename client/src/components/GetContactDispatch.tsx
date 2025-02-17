import React, { useState, useEffect, ReactComponentElement, ReactElement, JSXElementConstructor } from 'react';
import { getContactDispatchAPI } from '../utils/API';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const GetContactDispatch = (data:any) => {
  const [contactDispatchData, setContactDispatchData] = useState<any>({});
  const [modifier, setModifier] = useState(0);

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  const pages = Math.ceil(contactDispatchDataLength / 100)-1;
  
  useEffect(() => {
    const getContactDispatchData = async() => {
      try {
        const response = await getContactDispatchAPI();

        if (!response.ok) {
          const error = JSON.stringify(response);
          throw new Error(`something went wrong!: ${error}`);
        }

        const accounts = await response.json();
        setContactDispatchData(accounts);
      } catch (err) {
        console.error(err);
      }
    };
    
    const interval = setInterval(() => {
      getContactDispatchData();
    }, 10000);
    getContactDispatchData();
    data.setMax(pages);

    return () => clearInterval(interval);

  }, [contactDispatchDataLength]);

  useEffect(() => {
    setModifier(data.pageNum*100);
  }, [data.pageNum])
    
  if (!contactDispatchDataLength) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="secondary" disableShrink />
      </Box>
    );
  }

  const contactDispatchStyles = {
    tableStyles: {
      marginLeft: '1%',
      width: '95%'
    },
    tableField: {
      borderBottom: 'solid 1px',
      fontSize: '18px',
      width: '10%'
    },
    tableFieldSmall: {
      borderBottom: 'solid 1px',
      fontSize: '18px',
      width: '2%'
    },
    tableFieldLarge: {
      borderBottom: 'solid 1px',
      fontSize: '18px',
      width: '25%'
    }
  }

  return (
    <>
      <div>
        <table style={contactDispatchStyles.tableStyles}>
          <thead>
            <tr style={{width:"100%"}}>
              <td style={contactDispatchStyles.tableFieldSmall}>Client Number</td>
              <td style={contactDispatchStyles.tableFieldLarge}>Client Name</td>
              <td style={contactDispatchStyles.tableFieldSmall}>Billing Code</td>
              <td style={contactDispatchStyles.tableFieldSmall}>Initials</td>
              <td style={contactDispatchStyles.tableField}>Update Start Date</td>
              <td style={contactDispatchStyles.tableField}>Sent For Review On</td>
              <td style={contactDispatchStyles.tableFieldSmall}>Reviewer Initials</td>
              <td style={contactDispatchStyles.tableField}>Review Completed On</td>
              <td style={contactDispatchStyles.tableField}>Completion Date</td>
            </tr>
          </thead>
          <tbody>
            {(function (len) {
              let rows:any = [];
              for (let i = 0; i < len; i++) {
                if(contactDispatchData[i+modifier] == undefined) {
                  break;
                } else {
                  rows.push(
                    <tr id={`${i}`}>
                      <td style={contactDispatchStyles.tableFieldSmall}>{contactDispatchData[i+modifier].client_number}</td>
                      <td style={contactDispatchStyles.tableFieldLarge}>{contactDispatchData[i+modifier].client_name}</td>
                      <td style={contactDispatchStyles.tableFieldSmall}>{contactDispatchData[i+modifier].billing_code}</td>
                      <td style={contactDispatchStyles.tableFieldSmall}>{contactDispatchData[i+modifier].initials}</td>
                      <td style={contactDispatchStyles.tableField}>{contactDispatchData[i+modifier].start_date}</td>
                      <td style={contactDispatchStyles.tableField}>{contactDispatchData[i+modifier].review_sent_date}</td>
                      <td style={contactDispatchStyles.tableFieldSmall}>{contactDispatchData[i+modifier].reviewer_initials}</td>
                      <td style={contactDispatchStyles.tableField}>{contactDispatchData[i+modifier].review_complete_date}</td>
                      <td style={contactDispatchStyles.tableField}>{contactDispatchData[i+modifier].completion_date}</td>
                    </tr>)
                }
              }
              return rows;
            })(100)}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GetContactDispatch;