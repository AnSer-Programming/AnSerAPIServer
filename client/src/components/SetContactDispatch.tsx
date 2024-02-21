import { useState, useEffect } from 'react';
import { getContactDispatchAPI, setContactDispatchAPI } from '../utils/API';
import SetContactDispatchAccountNum from './SetContactDispatchComponents/SetContactDispatchAccountNum';
import SetContactDispatchAccountStatus from './SetContactDispatchComponents/SetContactDispatchAccountStatus';
import SetContactDispatchAccountType from './SetContactDispatchComponents/SetContactDispatchAccountType';
import SetContactDispatchAccountAPI from './SetContactDispatchComponents/SetContactDispatchAccountAPI';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const SetContactDispatch = (data:any) => {
  // let updateContactDispatchData:JSON = JSON.parse('{"Data":[]}');
  const [contactDispatchData, setContactDispatchData] = useState<any>({});
  const [modifier, setModifier] = useState<number>(0);

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  const pages = Math.ceil(contactDispatchDataLength / 100)-1;

  let updateContactDispatchData:any = [];
    
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
  
    getContactDispatchData();
    data.setMax(pages);
    setModifier(data.pageNum*100);
  
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
  
  const handleContactUpdate = async() => {
    try {
      const response = await setContactDispatchAPI(updateContactDispatchData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedContactDispatch = await response;
      setContactDispatchData(updatedContactDispatch);
    } catch (err) {
      console.error(`Update Error: ${err}`);
    }
  };

  const handleContactDispatchEdit = async(data:any) => {
    updateContactDispatchData = {data}
    console.log(`${JSON.stringify(data)}`);
  }

  const saveBtn = {
    display: 'flex',
    position: 'fixed' as const,
    right: '1%',
    textAlign: 'center' as const,
    bottom: '5%',
    width: '12%',
  }

  const tableStyles = {
    marginLeft: '1%',
    width: '75%'
  }

  const tableField = {
    fontSize: '18px',
    marginRight: '1%',
    width: '25%'
  }
  
  return (
    <>
      <button onClick={handleContactUpdate} style={saveBtn}>Save All Edits</button>
      <div>
        <table style={tableStyles}>
          <tbody>
            {(function() {
              let length:number = 100;
              let rows:any = [];
              for (let i = 0; i < length; i++) {
                if(contactDispatchData[i+modifier] == undefined) {
                  break;
                } else {
                  rows.push(
                    <tr>
                      <td style={tableField}>
                        Account Number: <br />
                        <SetContactDispatchAccountNum 
                          accountNum={contactDispatchData[i+modifier].account}
                        />
                      </td>
                      <td style={tableField}>
                        Status: 
                        <SetContactDispatchAccountStatus
                          status={contactDispatchData[i+modifier].status}
                          updateHandler={(accountStatusData:any) => {
                            let data = {account: contactDispatchData[i+modifier].account, status: accountStatusData};
                            handleContactDispatchEdit(data);
                          }}
                        /> 
                      </td>
                      <td style={tableField}>
                        Account Type: 
                        <SetContactDispatchAccountType
                          type={contactDispatchData[i+modifier].account_type}
                          updateHandler={(data:any) => handleContactDispatchEdit(data)}
                        /> 
                      </td>
                      <td style={tableField}>
                        API: <br />
                        <SetContactDispatchAccountAPI 
                          api={contactDispatchData[i+modifier].api}
                          updateHandler={(data:any) => handleContactDispatchEdit(data)}
                        />
                      </td>
                    </tr>
                  )
                }
              }
              return rows;
            }) ()}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SetContactDispatch;