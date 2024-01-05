import React, { useState, useEffect } from 'react';
import { setResidentDirectoryAPI } from '../../utils/API';
import TextField from '@mui/material/TextField';

const SetResidentDirectory = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>(data.accountData);
  
  // use this to determine if `useEffect()` hook needs to run again
  const schedulerDataLength = Object.keys(schedulerData).length;

  let updateSchedulerData:any = schedulerData;
  let placeHolder:number;
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }

  const handleDirectoryUpdate = async() => {
    // try {
    //   const response = await setResidentDirectoryAPI(data.accountNum, updateResidentDirectoryData);
  
    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }
  
    //   const updatedVessels = await response.json();
    //   setResidentDirectoryData(updatedVessels);
    // } catch (err) {
    //   console.error(err);
    // }
  };
  
  const handleSchedulerEdit = async(index:any, newValue:any, valueType:String) => {
    if(valueType == "resident_full_name") {
      updateSchedulerData[index] = {"resident_full_name": `${newValue}`, "resident_room_number": `${schedulerData[index]['resident_room_number']}`, "resident_phone_number": `${schedulerData[index]['resident_phone_number']}`};
    } else if(valueType == "resident_phone_number") {
      updateSchedulerData[index] = {"resident_full_name": `${schedulerData[index]['resident_full_name']}`, "resident_room_number": `${schedulerData[index]['resident_room_number']}`,  "resident_phone_number": `${newValue}`};
    } else if(valueType == "resident_room_number") {
      updateSchedulerData[index] = {"resident_full_name": `${schedulerData[index]['resident_full_name']}`, "resident_room_number": `${newValue}`, "resident_phone_number": `${schedulerData[index]['resident_phone_number']}`};
    }
    updateSchedulerData = JSON.parse(updateSchedulerData);
    setSchedulerData(updateSchedulerData);
  } 
  
  const handleAddRow = async() => {
    updateSchedulerData[schedulerDataLength] = {resident_full_name: null, resident_room_number: null, resident_phone_number: null};
    await setSchedulerData(updateSchedulerData);
  }
  
  const deleteRowHandler = (index:number) => {
    updateSchedulerData.splice(index, 1);
  }

  const saveAll = () => {
    handleDirectoryUpdate(); 
    data.setEdit(false);
  }

  const rowStyles = {
    height: '100%',
    width: '75%',
  }

  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  return (
    <>
      <div>
        <table>
          <tbody>
            {(
              function(){
                let rows:any = [];
                let length = 0;
                if(schedulerDataLength > 2){
                  length = schedulerDataLength;
                } else {
                  length = 3;
                }
                for (let index = 0; index < length; index++) { 
                  if(schedulerData[index] == undefined) {
                    rows.push(
                      <tr key={`blankRow${index}`} style={rowStyles}>
                        <td key={`blankName${index}`} style={fieldStyles}>
                          Resident Name: <br />
                          <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleSchedulerEdit(index, event.target.value, "Name");
                          }} 
                          sx={{ width: 250, background: 'white', zIndex: 0 }}
                          variant="filled" />
                        </td>
                        <td key={`blankRoom${index}`} style={fieldStyles}>
                          Resident Room Number: <br />
                          <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleSchedulerEdit(index, event.target.value, "RoomNum");
                            }} 
                            sx={{ width: 250, background: 'white', zIndex: 0 }}
                            variant="filled" />
                        </td>
                        <td key={`blankPhone${index}`} style={fieldStyles}>
                          Resident Phone Number: <br />
                          <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleSchedulerEdit(index, event.target.value, "PhoneNum");
                            }} 
                            sx={{ width: 250, background: 'white', zIndex: 0 }}
                            variant="filled" />
                        </td>
                        <td style={fieldStyles}>
                          <br /><button onClick={() => deleteRowHandler(index)} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
                        </td>
                      </tr>
                    )
                  } else {
                    rows.push(
                      <tr key={`row${index}`} style={rowStyles}>
                        <td key={schedulerData[index].resident_full_name} style={fieldStyles}>
                          Resident Name: <br />
                          <TextField label={schedulerData[index].resident_full_name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleSchedulerEdit(index, event.target.value, "Name");
                          }} 
                          sx={{ width: 250, background: 'white', zIndex: 0 }}
                          variant="filled" />
                        </td>
                        <td key={schedulerData[index].resident_room_number} style={fieldStyles}>
                          Resident Room Number: <br />
                          <TextField label={schedulerData[index].resident_room_number} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleSchedulerEdit(index, event.target.value, "RoomNum");
                            }} 
                            sx={{ width: 250, background: 'white', zIndex: 0 }}
                            variant="filled" />
                        </td>
                        <td key={schedulerData[index].resident_phone_number} style={fieldStyles}>
                          Resident Room Number: <br />
                          <TextField label={schedulerData[index].resident_phone_number} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleSchedulerEdit(index, event.target.value, "PhoneNum");
                            }} 
                            sx={{ width: 250, background: 'white', zIndex: 0 }}
                            variant="filled" />
                        </td>
                        <td style={fieldStyles}>
                          <br /><button onClick={() => deleteRowHandler(index)} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
                        </td>
                      </tr>
                    )
                  }
                }
                return rows;
              } ()
            )}
          </tbody>
        </table> <br />
        <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
        <button onClick={saveAll} id="saveBtn">Save and View</button>
      </div>
    </>
  );
};

export default SetResidentDirectory;