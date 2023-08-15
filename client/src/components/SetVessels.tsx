import React from 'react'; 
import { useState, useEffect } from 'react';
import { getVesselsAPI, setVesselsAPI } from '../utils/API';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetVessels = ({accountNum, setEdit}) => {
  const [vesselData, setVesselData] = useState<any[]>([]);
  const [option, setOptions] = useState<String[]>([]);
  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;

  useEffect(() => {
    const getVesselData = async() => {
      try {
        const response = await getVesselsAPI(accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        vessel.VesselsOwners = vessel.VesselsOwners.sort(((a, b) =>  a.Person.localeCompare(b.Person)));
        setVesselData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };

    const options = async() => {
      switch(accountNum) {
        case '38':
          setOptions(["Adam Jeanquart", "Billy Palmer", "Cristian Mueller", "Jane Coleman", "Sam Cloyd", "Stephen Merki"]);
          break;
        case '6071':
          setOptions(
            ["Chris Thibodeaux", "Eric Steudelin", "Jeremy", 
            "Jon Tarver", "Kevin Hunt", "Kraig Prinz",
            "Randy Dedon", "Ronnie Dedon", "Terry Rodney", 
            "TJ", "Trent Blanchard", "Walter Cryer", "Wayne"]
          );
          break;
        default:
          setOptions(["Invalid option"]);
          break;
      }
    };
  
    options();
    getVesselData();
  }, [vesselDataLength, accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  let updateVesselData:any = vesselData;
  
  let updateVesselDataLength:number = vesselDataLength;

  function tableBuilder(index) {
    return (
      <tr style={rowStyles}>
        <td style={fieldStyles}>
          Vessel: <br />
          <TextField label={vesselData[index].Vessel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleVesselEdit(index, event.target.value, "Vessel");
          }} 
          sx={{ width: 250, background: 'white'}} />
        </td>
        <td style={fieldStyles}>
          Contact: <Autocomplete
            id={"vesselInput"}
            disablePortal
            onChange={(event, newInputValue) => {
              handleVesselEdit(index, newInputValue, "Person");
            }}
            options={option}
            sx={{ width: 250, background: 'white'}}
            renderInput={(params) => <TextField {...params} label={vesselData[index].Person} />}
          /> 
        </td>
        <td style={fieldStyles}>
          <button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`}>Delete Row</button>
        </td>
      </tr>
    )
  }

  const handleVesselUpdate = async() => {
    updateVesselData = await {VesselsOwners: updateVesselData};
    try {
      const response = await setVesselsAPI(accountNum, updateVesselData);
  
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
  
      const updatedVessels = await response.json();
      setVesselData(updatedVessels);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleVesselEdit = async(index:any, newValue:any, valueType:String) => {
    if(valueType == "Vessel") {
      updateVesselData[index] = {"Vessel": `${newValue}`, "Person": `${vesselData[index]['Person']}`};
    } else if(valueType == "Person") {
      updateVesselData[index] = {"Vessel": `${vesselData[index]['Vessel']}`, "Person": `${newValue}`};
    }
    setVesselData(updateVesselData);
  } 
  
  const handleAddRow = async() => {
    const newObj = {"Vessel": " ", "Person": " "};
    updateVesselData[updateVesselDataLength] = await newObj;
    updateVesselDataLength +=1;
    handleVesselUpdate(); 
  }
  
  const deleteRowHandler = (index:number) => {
    updateVesselData.splice(index, 1);
    handleVesselUpdate();
  }

  const saveAll = () => {
    handleVesselUpdate(); 
    setEdit(false);
  }

  const rowStyles = {
    width: '75%',
  }

  const fieldStyles = {
    width: '25%',
  }

  return (
    <>
    <div>
      <table>
        <tbody>
          {Object.keys(vesselData).map((index) => (tableBuilder(index)))}
        </tbody>
      </table> <br />
      <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
      <button onClick={saveAll} id="saveBtn">Save and View</button>
    </div>
    </>
  );
};

export default SetVessels;