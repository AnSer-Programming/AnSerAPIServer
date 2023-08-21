import { useState, useEffect } from 'react';
import { getContactDispatchAPI, setContactDispatchAPI } from '../utils/API';
import SetContactDispatchAccountNum from './SetContactDispatchAccountNum';
import SetContactDispatchAccountStatus from './SetContactDispatchAccountStatus';
import SetContactDispatchAccountType from './SetContactDispatchAccountType';
import SetContactDispatchAccountAPI from './SetContactDispatchAccountAPI';

const SetContactDispatch = (data:any) => {
  // let updateContactDispatchData:JSON = JSON.parse('{"Data":[]}');
  const [contactDispatchData, setContactDispatchData] = useState<any>({});
  const [modifier, setModifier] = useState<number>(0);

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  const pages = Math.ceil(contactDispatchDataLength / 100)-1;
    
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
  
  }, [contactDispatchDataLength, data.pageNum]);
    
  if (!contactDispatchDataLength) {
    return <h2>LOADING...</h2>;
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

  const handleContactDispatchEdit = async(data:any) => {
    console.log(`${data}`);
  }

  // const saveBtn = {
  //   display: 'flex',
  //   position: 'fixed' as const,
  //   right: '1%',
  //   textAlign: 'center' as const,
  //   bottom: '5%',
  //   width: '12%',
  // }

  const tableStyles = {
    marginLeft: '1%',
    width: '90%'
  }

  const tableField = {
    fontSize: '18px',
    marginRight: '1%',
    width: '25%'
  }
  
  return (
    <>
      {/* <button onClick={handleContactDispatchEdit} style={saveBtn}>Save All Edits</button> */}
      <div>
        <table style={tableStyles}>
          <tbody>
            {(function (len) {
              let rows:any = [];
              for (let i = 0; i < len; i++) {
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
                          updateHandler={(data:any) => handleContactDispatchEdit(data)}
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
                        API: 
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
            })(100)}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SetContactDispatch;