import { useState, useEffect } from 'react';
import { getContactDispatchAPI, updateContactDispatchAPI } from '../utils/API';
import SetContacTextFieldReadOnly from './SetContactDispatchComponents/SetContacTextFieldReadOnly';
import SetContacTextFieldInput from './SetContactDispatchComponents/SetContacTextFieldInput';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import zIndex from '@mui/material/styles/zIndex';

interface contactDispatchJSON {
  initials: string;
  start_date: string;
  review_sent_date: string;
  reviewer_initials: string;
  review_complete_date: string;
  completion_date: string;
}

const SetContactDispatch = (data: any) => {
  // let updateContactDispatchData:JSON = JSON.parse('{"Data":[]}');
  const [contactDispatchData, setContactDispatchData] = useState<any>({});
  const [modifier, setModifier] = useState<number>(0);

  // use this to determine if `useEffect()` hook needs to run again
  const contactDispatchDataLength = Object.keys(contactDispatchData).length;
  const pages = Math.ceil(contactDispatchDataLength / 100) - 1;

  useEffect(() => {
    const getContactDispatchData = async () => {
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
    setModifier(data.pageNum * 100);
  }, [data.pageNum])

  if (!contactDispatchDataLength) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="secondary" disableShrink />
      </Box>
    );
  }

  const handleContactUpdate = async (updateContactDispatchData: any, id: any) => {
    try {
      const response = await updateContactDispatchAPI(updateContactDispatchData, id);

      if (!response.ok) {
        throw new Error('something went wrong!');
      } else {
        try {
          const response = await getContactDispatchAPI();

          if (!response.ok) {
            console.log(response);
            throw new Error('something went wrong!');
          }

          const accounts = await response.json();
          setContactDispatchData(accounts);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(`Update Error: ${err}`);
    }
  };

  const handleContactDispatchEdit = async (data: any) => {
    console.log(data);
    let updateContactDispatchData: any = {};
    let id = data.id;
    console.log(contactDispatchData.length);
    for(let i = 0; i < contactDispatchData.length; i++) {
      if(contactDispatchData[i].id == id) {
        updateContactDispatchData = contactDispatchData[i];
        updateContactDispatchData[data.type] = `${data.value}`;
        console.log(updateContactDispatchData);
        break;
      }
    }

    handleContactUpdate(updateContactDispatchData, id)
    // console.log(`${JSON.stringify(data)}`);
  }

  const contactDispatchStyles = {
    tableHolder: {
      height: '65vh',
      overflow: 'auto',
      zIndex: 0,
    },
    tableStyles: {
      marginLeft: '1%',
      padding: '0px',
      width: '99%'
    },
    tableHeaderStyles: {
      position: 'sticky',
      top: '0px',
      zIndex: 1,
    } as React.CSSProperties,
    tableField: {
      fontSize: '18px',
      margin: '0px',
      padding: '0px',
      width: '10%'
    },
    tableFieldSmall: {
      fontSize: '18px',
      margin: '0px',
      padding: '0px',
      width: '7%'
    },
    tableFieldLarge: {
      fontSize: '18px',
      margin: '0px',
      padding: '0px',
      width: '15%'
    }
  }

  return (
    <>
      <div style={contactDispatchStyles.tableHolder}>
        <table style={contactDispatchStyles.tableStyles}>
          <thead style={contactDispatchStyles.tableHeaderStyles} className='bg-dark'>
            <tr className='bg-dark'>
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
            {(function () {
              let length: number = 100;
              let rows: any = [];
              for (let i = 0; i < length; i++) {
                if (contactDispatchData[i + modifier] == undefined) {
                  break;
                } else {
                  rows.push(
                    <tr>
                      <td style={contactDispatchStyles.tableFieldSmall}>
                        <SetContacTextFieldReadOnly
                          placeHolder={contactDispatchData[i + modifier].client_number}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableFieldLarge}>
                        <SetContacTextFieldReadOnly
                          placeHolder={contactDispatchData[i + modifier].client_name}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableFieldSmall}>
                        <SetContacTextFieldReadOnly
                          placeHolder={contactDispatchData[i + modifier].billing_code}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableFieldSmall}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].initials}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "initials", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableField}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].start_date}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "start_date", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableField}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].review_sent_date}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "review_sent_date", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableFieldSmall}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].reviewer_initials}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "reviewer_initials", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableField}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].review_complete_date}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "review_complete_date", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                      <td style={contactDispatchStyles.tableField}>
                        <SetContacTextFieldInput
                          placeHolder={contactDispatchData[i + modifier].completion_date}
                          updateHandler={(data: any) => handleContactDispatchEdit({ type: "completion_date", value: data, id: contactDispatchData[i + modifier].id })}
                        />
                      </td>
                    </tr>
                  )
                }
              }
              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SetContactDispatch;