import React from 'react'; 
import { useState, useEffect } from 'react';
import { getVesselsAPI, setVesselsAPI } from '../utils/API';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SetVessels = (data:any) => {
  const [vesselData, setVesselData] = useState<any[]>([]);
  const [option, setOptions] = useState<String[]>([]);
  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;
  let placeHolder:{};

  useEffect(() => {
    const getVesselData = async() => {
      try {
        const response = await getVesselsAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        vessel.VesselsOwners = vessel.VesselsOwners.sort(((a:any, b:any) =>  a.Person.localeCompare(b.Person))).reverse();
    
        if(data.accountNum == 38 || data.accountNum == 6071) {
            for(var i:number = 0; i < vessel.VesselsOwners.length; i++) {
                if(vessel.VesselsOwners[i].Vessel == "Unlisted") {
                    if(vessel.VesselsOwners[i].Person != "Misc") {
                      vessel.VesselsOwners[i].Person = "Misc";
                    }
                    if(i < vessel.VesselsOwners.length) {
                        placeHolder = vessel.VesselsOwners[i];
                        vessel.VesselsOwners.splice(i, 1);
                        vessel.VesselsOwners[vessel.VesselsOwners.length] = placeHolder;
                    }
                    break;
                } else {
                    if(vessel.VesselsOwners.length == i) {
                      vessel.VesselsOwners[i] = {Vessel: "Unlisted", Person: "Misc"};
                    }
                }
            }
        } //list, blank, then Unlisted
    
        if(data.accountNum == 38 || data.accountNum == 6071) {
          for(var i:number = vessel.VesselsOwners.length-1; i > 0; i--) {
            if(vessel.VesselsOwners[i].Vessel == "Unlisted") {
              if(vessel.VesselsOwners[i].Person != "Misc") {
                vessel.VesselsOwners[i].Person = "Misc";
              }
              if(vessel.VesselsOwners[i-1].Vessel == " ") {
                placeHolder = vessel.VesselsOwners[i];
                vessel.VesselsOwners[i] = vessel.VesselsOwners[i-1];
                vessel.VesselsOwners[i-1] = placeHolder;
              }
            }
          }
        } // list, unlisted, then blank

        setVesselData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };

    const options = async() => {
      switch(data.accountNum) {
        case '38':
          setOptions((["Adam Jeanquart", "Billy Palmer", "Cristian Mueller", "Jane Coleman", "Sam Cloyd", "Stephen Merki"]).sort());
          break;
        case '6071':
          setOptions(
            (["Chris Thibodeaux", "Eric Steudelin", "Jeremy", 
            "Jon Tarver", "Kevin Hunt", "Kraig Prinz",
            "Randy Dedon", "Ronnie Dedon", "Terry Rodney", 
            "TJ", "Trent Blanchard", "Walter Cryer", "Wayne"]).sort()
          );
          break;
        default:
          setOptions(["Invalid option"]);
          break;
      }
    };
  
    options();
    getVesselData();
  }, [vesselDataLength, data.accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  let updateVesselData:any = vesselData;
  
  let updateVesselDataLength:number = vesselDataLength;

  function tableBuilder(index:any) {
    return (
      <tr key={`row${index}`} style={rowStyles}>
        <td key={vesselData[index].Vessel} style={fieldStyles}>
          Vessel: <br />
          <TextField label={vesselData[index].Vessel} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleVesselEdit(index, event.target.value, "Vessel");
          }} 
          sx={{ width: 250, background: 'white'}}
          variant="filled" />
        </td>
        <td key={vesselData[index].Person} style={fieldStyles}>
          Contact: <Autocomplete
            id={"vesselInput"}
            disablePortal
            onChange={(event, newInputValue) => {
              handleVesselEdit(index, newInputValue, "Person");
            }}
            options={option}
            sx={{ width: 250, background: 'white'}}
            renderInput={(params) => <TextField {...params} label={vesselData[index].Person} 
            variant="filled"/>}
          /> 
        </td>
        <td style={fieldStyles}>
          <br /><button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
        </td>
      </tr>
    )
  }

  const handleVesselUpdate = async() => {
    updateVesselData = await {VesselsOwners: updateVesselData};
    try {
      const response = await setVesselsAPI(data.accountNum, updateVesselData);
  
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