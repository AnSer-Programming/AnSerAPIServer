import React, { useState, useEffect } from 'react';
import { setSchedulerAPI, getSchedulerAPI } from '../../utils/API';
import { pink, green } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

interface placeHolder {
  Date: string;
  Time: string;
  Availability: string;
}

const SetScheduler = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [headerData, setHeaderData] = useState<any>([]);
  const [arrayData, setArrayData] = useState<placeHolder[]>([]);
  
  // use this to determine if `useEffect()` hook needs to run again
  const schedulerDataLength = Object.keys(schedulerData).length;
  useEffect(() => {
    const getSchedulerData = async() => {
      try {
        const response = await getSchedulerAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let responseData = await response.json();
        
        setSchedulerData(responseData);
        setHeaderData(Object.keys(responseData));
      } catch (err) {
        console.error(err);
      }
    };

    getSchedulerData();
  }, [arrayData.length, data.accountNum])
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }

  if(arrayData.length < 1) {
    for(let x = 0; x < headerData.length; x++) {
      for(let y = 0; y < schedulerData[headerData[x]].length; y++) {
        arrayData.push({Date: headerData[x], Time: `${schedulerData[headerData[x]][y].Time}`, Availability: `${schedulerData[headerData[x]][y].Availability}`});
      }
    }
  }

  const handleSchedulerUpdate = async() => {
    let updateSchedulerData:any = {};
    let date:string = "0";
    arrayData.sort((a:any, b:any) => (a.Date < b.Date ? -1 : 1));
    for(let i = 0; i < arrayData.length; i++) {
      if(date != arrayData[i].Date) {
        date = arrayData[i].Date;
        updateSchedulerData[date] = [{Time: `${arrayData[i].Time}`, Availability: `${arrayData[i].Availability}`}];
      } else {
        updateSchedulerData[date][updateSchedulerData[date].length] = {Time: `${arrayData[i].Time}`, Availability: `${arrayData[i].Availability}`};
      }
    }
    Object.keys(updateSchedulerData).map(async(dates) => (await updateSchedulerData[dates].sort((a:any, b:any) => (a.Time < b.Time ? -1 : 1))));
    try {
      const response = await setSchedulerAPI(data.accountNum, updateSchedulerData);
  
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
  
      const updatedSchedulerData = await response.json();
      setSchedulerData(updatedSchedulerData);
    } catch (err) {
      console.error(err);
    }
  }
  
  const handleSchedulerEdit = async(index:any, newValue:any, valueType:String) => {
    switch(valueType) {
      case "Date": {
        arrayData[index].Date = newValue;
        break;
      }
      case "Time": {
        arrayData[index].Time = newValue;
        break;
      }
      case "Availability": {
        if(arrayData[index].Availability === "Available") {
          arrayData[index].Availability = "Unavailable";
        } else {
          arrayData[index].Availability = "Available";
        }
        break;
      }
    }
    setSchedulerData(arrayData);
  } 
  
  const handleAddRow = async() => {
    arrayData.push({Date: ``, Time: ``, Availability: `Available`});
    setSchedulerData(arrayData);
  }
  
  const deleteRowHandler = (index:number) => {
    arrayData.splice(index, 1);
    setSchedulerData(arrayData);
  }

  const saveAll = () => {
    handleSchedulerUpdate(); 
    data.setEdit(false);
  }

  const rowStyles = {
    height: '100%',
    minWidth: '25%',
    width: '30%',
  }

  const fieldStyles = {
    height: '75%',
    width: '25%',
  }

  const checkBoxFieldStyles = {
    height: '75%',
    width: '25%',
  }

  const tableBuilder = () => {
    let rows:any = [];
    for(let i = 0; i < arrayData.length; i++) {
      if(typeof(arrayData[i]) != "undefined") {
        if(arrayData[i].Availability === "Available") {
          rows.push(
            <tr style={rowStyles}>
              <td style={fieldStyles}>
                <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Date");
                  }} 
                  label={arrayData[i].Date}
                  sx={{background:'white'}} />
              </td>
              <td style={fieldStyles}>
                <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Time");
                  }} 
                  label={arrayData[i].Time.toString()}
                  sx={{background:'white'}} />
              </td>
              <td style={checkBoxFieldStyles} className='text-center'>
                <Checkbox onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Availability");
                  }} 
                  sx={{
                    background:'white',
                    color: green[400],
                    '&.Mui-checked': {
                      color: pink[400],
                    }, 
                  }} />
              </td>
              <td style={fieldStyles}>
                <button onClick={() => deleteRowHandler(i)} id={`${i}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
              </td>
            </tr>
          );
        } else {
          rows.push(
            <tr style={rowStyles}>
              <td style={fieldStyles}>
                <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Date");
                  }} 
                  label={arrayData[i].Date}
                  sx={{background:'white'}} />
              </td>
              <td style={fieldStyles}>
                <TextField onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Time");
                  }} 
                  label={arrayData[i].Time.toString()}
                  sx={{background:'white'}} />
              </td>
              <td style={checkBoxFieldStyles} className='text-center'>
                <Checkbox defaultChecked onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleSchedulerEdit(i, event.target.value, "Availability");
                  }} 
                  sx={{
                    background:'white',
                    color: green[400],
                    '&.Mui-checked': {
                      color: pink[400],
                    },
                  }} />
              </td>
              <td style={fieldStyles}>
                <button onClick={() => deleteRowHandler(i)} id={`${i}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
              </td>
            </tr>
          );
        }
      }
    }
    
    return <><table style={{width: '30%'}}><tbody>{rows}</tbody></table></>;
  }

  return (
    <>
      <div>
        Use the check box to set if the date and time are available.<br />
        Checked = Unavailable&emsp;<Checkbox defaultChecked disabled sx={{ color: green[400], '&.Mui-checked': { color: pink[400], }, background: 'white' }} /> &emsp;
        Unchecked = Available&emsp;<Checkbox disabled color="default" sx={{ color: green[400], '&.Mui-checked': { color: pink[400], }, background: 'white' }} /><br /><br />
        {tableBuilder()} <br />
        <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
        <button onClick={saveAll} id="saveBtn">Save and View</button>
      </div>
    </>
  );
};

export default SetScheduler;