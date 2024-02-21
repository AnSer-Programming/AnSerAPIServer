import React from 'react'; 
import { useState, useEffect } from 'react';
import { getVesselsDBAPI, setVesselsDBAPI, updateVesselsDBAPI, deleteVesselsDBAPI } from '../../utils/API';
import VesselName from './VesselName';
import VesselContact from './VesselContact';

const SetVessels = (data:any) => {
  const [vesselData, setVesselData] = useState<any>({});
  const [option, setOptions] = useState<String[]>([]);
  let updateVesselData:any = vesselData;
  const vesselDataLength = Object.keys(vesselData).length;
  let updateVesselDataLength:number = updateVesselData.length;
  let placeHolder:{};
  const getVesselData = async() => {
    try {
      const response = await getVesselsDBAPI(data.accountNum);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      let vessel = await response.json();
      vessel = vessel.sort(((a:any, b:any) =>  a.contact_name.localeCompare(b.contact_name))).reverse();
  
      if(data.accountNum == 38 || data.accountNum == 6071) {
        let unlistedFound = false;
        for(var i:number = 0; i < vessel.length; i++) {
          if(vessel[i].vessel_name == "Unlisted") {
            unlistedFound = true;
            if(vessel[i].contact_name != "Misc") {
              vessel[i].contact_name = "Misc";
            }
            if(i < vessel.length) {
              placeHolder = vessel[i];
              vessel.splice(i, 1);
              vessel[vessel.length] = placeHolder;
            }
            break;
          } 
        }
        if(!unlistedFound) {
          setVesselsDBAPI({vessel_name: "Unlisted", contact_name: "Misc", account_num: `${data.accountNum}`});
        }
      } //list, blank, then Unlisted
  
      if(data.accountNum == 38 || data.accountNum == 6071) {
        for(var i:number = vessel.length-1; i > 0; i--) {
          if(vessel[i].vessel_name == "Unlisted") {
            if(vessel[i].contact_name != "Misc") {
              vessel[i].contact_name = "Misc";
            }
            if(vessel[i-1].vessel_name == " ") {
              placeHolder = vessel[i];
              vessel[i] = vessel[i-1];
              vessel[i-1] = placeHolder;
            }
          }
        }
      } // list, unlisted, then blank

      setVesselData(vessel);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const options = async() => {
      switch(data.accountNum) {
        case '38':
          setOptions((["Adam Jeanquart", "Billy Palmer", "Cristian Mueller", "Sam Cloyd", "Stephen Merki"]).sort());
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

  function tableBuilder() {
    let rows = new Array(vesselDataLength);

    for(let i = 0; i < vesselDataLength; i++) {
      rows.push(
        <tr key={`row${i}`} style={rowStyles}>
          <VesselName
            i = {i}
            vessel_name = {vesselData[i].vessel_name}
            vesselEdit={(i:number, value:string) => handleVesselEdit(i, value, "vessel_name")} />
          <VesselContact
            i = {i}
            contact_name = {vesselData[i].contact_name}
            vesselEdit = {(i:number, value:string) => handleVesselEdit(i, value, "contact_name")}
            options = {option} />
          <td style={fieldStyles}>
            <br /><button onClick={() => deleteRowHandler(parseInt(vesselData[i].index))} id={`${i}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Row</button>
          </td>
        </tr>
      )
    }
    
    return rows;
  }
  
  const handleVesselEdit = async(i:any, newValue:any, valueType:String) => {
    if(valueType == "vessel_name") {
      updateVesselData[i] = {vessel_name: `${newValue}`, contact_name: `${vesselData[i]['contact_name']}`, index: `${vesselData[i].index}`, account_num: `${data.accountNum}`};
    } else if(valueType == "contact_name") {
      updateVesselData[i] = {vessel_name: `${vesselData[i]['vessel_name']}`, "contact_name": `${newValue}`, index: `${vesselData[i].index}`, account_num: `${data.accountNum}`};
    }
    updateVesselsDBAPI(updateVesselData[i].index, updateVesselData[i]);
    setVesselData(updateVesselData);
  } 
  
  const handleAddRow = async() => {
    const newObj = {"vessel_name": "Null", "contact_name": "Null", "account_num": `${data.accountNum}`};
    setVesselsDBAPI(newObj);
    getVesselData();
  }
  
  const deleteRowHandler = (index:number) => {
    deleteVesselsDBAPI(index);
    getVesselData();
  }

  const saveAll = () => {
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
        <tbody key="TableBody">
          {tableBuilder()}
        </tbody>
      </table> <br />
      <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
      <button onClick={saveAll} id="saveBtn">Save and View</button>
    </div>
    </>
  );
};

export default SetVessels;