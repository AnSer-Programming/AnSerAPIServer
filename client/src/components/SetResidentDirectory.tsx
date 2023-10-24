import React from 'react'; 
import { useState, useEffect } from 'react';
import { getResidentDirectoryAPI, setResidentDirectoryAPI } from '../utils/API';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetVessels = (data:any) => {
  const [residentDirectoryData, setResidentDirectoryData] = useState<any[]>([]);
  
  // use this to determine if `useEffect()` hook needs to run again
  const residentDirectoryDataLength = Object.keys(residentDirectoryData).length;
  let placeHolder:{};

  useEffect(() => {
    const getResidentDirectoryData = async() => {
      try {
        const response = await getResidentDirectoryAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        

        setResidentDirectoryData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };
    
    getResidentDirectoryData();
  }, [residentDirectoryDataLength, data.accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run
  
  if (!residentDirectoryDataLength) {
    return <h2>LOADING...</h2>;
  }

  let updateResidentDirectoryData:any = residentDirectoryData;
  
  let updateResidentDirectoryDataLength:number = residentDirectoryDataLength;

  function tableBuilder(index:any) {
    return (
      <tr key={`row${index}`} style={rowStyles}>
        <td key={residentDirectoryData[index].Vessel} style={fieldStyles}>
          Vessel: <br />
          <TextField label={residentDirectoryData[index].Vessel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleVesselEdit(index, event.target.value, "Vessel");
          }} 
          sx={{ width: 250, background: 'white', zIndex: 0 }}
          variant="filled" />
        </td>
        <td key={residentDirectoryData[index].Person} style={fieldStyles}>
          Contact: <br />
          <TextField label={residentDirectoryData[index].Person} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							handleVesselEdit(index, event.target.value, "Person");
						}} 
						sx={{ width: 250, background: 'white', zIndex: 0 }}
						variant="filled" />
        </td>
        <td style={fieldStyles}>
          <br /><button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
        </td>
      </tr>
    )
  }

  const handleVesselUpdate = async() => {
    updateResidentDirectoryData = await {Data: updateResidentDirectoryData};
    try {
      const response = await setResidentDirectoryAPI(data.accountNum, updateResidentDirectoryData);
  
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
  
      const updatedVessels = await response.json();
      setResidentDirectoryData(updatedVessels);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleVesselEdit = async(index:any, newValue:any, valueType:String) => {
    if(valueType == "Vessel") {
      updateResidentDirectoryData[index] = {"Vessel": `${newValue}`, "Person": `${residentDirectoryData[index]['Person']}`};
    } else if(valueType == "Person") {
      updateResidentDirectoryData[index] = {"Vessel": `${residentDirectoryData[index]['Vessel']}`, "Person": `${newValue}`};
    }
    setResidentDirectoryAPI(updateResidentDirectoryData);
  } 
  
  const handleAddRow = async() => {
    const newObj = {"Vessel": " ", "Person": " "};
    updateResidentDirectoryData[updateResidentDirectoryDataLength] = await newObj;
    updateResidentDirectoryDataLength +=1;
    handleVesselUpdate(); 
  }
  
  const deleteRowHandler = (index:number) => {
    updateResidentDirectoryData.splice(index, 1);
    handleVesselUpdate();
  }

  const saveAll = () => {
    handleVesselUpdate(); 
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
          {Object.keys(residentDirectoryData).map((index) => (tableBuilder(index)))}
        </tbody>
      </table> <br />
      <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
      <button onClick={saveAll} id="saveBtn">Save and View</button>
    </div>
    </>
  );
};

export default SetVessels;