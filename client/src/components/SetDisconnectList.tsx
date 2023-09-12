import React from 'react'; 
import { useState, useEffect } from 'react';
import { getDisconnectListAPI, setDisconnectListAPI } from '../utils/API';
import TextField from '@mui/material/TextField';

const SetDisconnectList = (data:any) => {
  const [disconnectListData, setDisconnectListData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const disconnectListDataLength = Object.keys(disconnectListData).length;
  let placeHolder:{};

  let updateDisconnectListData:any = disconnectListData;
  
  let updateDisconnectListDataLength:number = disconnectListDataLength;
  
  useEffect(() => {
    const getDisconnectListData = async() => {
      try {
        const response = await getDisconnectListAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let list = await response.json();
        list.DisconnectList = list.DisconnectList.sort(((a:any, b:any) =>  a.PropertyOwner.localeCompare(b.PropertyOwner))).reverse();
    
        if(data.accountNum == 38 || data.accountNum == 6509) {
            for(var i:number = 0; i < list.DisconnectList.length; i++) {
                if(list.DisconnectList[i].PropertyOwner == "Unlisted") {
                    if(i < list.DisconnectList.length) {
                        placeHolder = list.DisconnectList[i];
                        list.DisconnectList.splice(i, 1);
                        list.DisconnectList[list.DisconnectList.length] = placeHolder;
                    }
                    break;
                } else {
                    if(list.DisconnectList.length == i) {
                      list.DisconnectList[i] = {PropertyOwner: "Unlisted"};
                    }
                }
            }
        } //list, blank, then Unlisted
    
        if(data.accountNum == 38 || data.accountNum == 6509) {
          for(var i:number = list.DisconnectList.length-1; i > 0; i--) {
            if(list.DisconnectList[i].PropertyOwner == "Unlisted") {
              if(list.DisconnectList[i-1].PropertyOwner == " ") {
                placeHolder = list.DisconnectList[i];
                list.DisconnectList[i] = list.DisconnectList[i-1];
                list.DisconnectList[i-1] = placeHolder;
              }
            }
          }
        } // list, unlisted, then blank
        setDisconnectListData(list.DisconnectList);
      } catch (err) {
        console.error(err);
      }
    };
    
    getDisconnectListData();
  }, [disconnectListDataLength, data.accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run
  
  if (!disconnectListDataLength) {
    return <h2>LOADING...</h2>;
  }

  function tableBuilder(index:any) {
    return (
      <>
        <tr key={`primaryRow${index}`} style={rowStyles}>
          <td key={disconnectListData[index].PropertyOwner} style={fieldStyles}>
            Property Owner: <br />
            <TextField label={disconnectListData[index].PropertyOwner} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "PropertyOwner");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td key={disconnectListData[index].Street} style={fieldStyles}>
            Street: <br />
            <TextField label={disconnectListData[index].Street} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "Street");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td key={disconnectListData[index].City} style={fieldStyles}>
            City: <br />
            <TextField label={disconnectListData[index].City} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "City");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td key={disconnectListData[index].State} style={fieldStyles}>
            State: <br />
            <TextField label={disconnectListData[index].State} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "State");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
        </tr>
        <tr key={`secondaryRow${index}`} style={rowStyles}>
          <td key={disconnectListData[index].Zip} style={fieldStyles}>
            Zip: <br />
            <TextField label={disconnectListData[index].Zip} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "Zip");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td key={disconnectListData[index].Amount} style={fieldStyles}>
            Amount: <br />
            <TextField label={disconnectListData[index].Amount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "Amount");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td key={disconnectListData[index].Notes} style={fieldStyles}>
            Notes: <br />
            <TextField label={disconnectListData[index].Notes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleVesselEdit(index, event.target.value, "Notes");
            }} 
            sx={{ width: 250, background: 'white'}}
            variant="filled" />
          </td>
          <td style={fieldStyles}>
            <br /><button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Listing</button>
          </td>
        </tr>
        <tr key={`gapRow${ index }`} style={{borderBottom: '2px solid', height: '15px'}}></tr>
      </>
    )
  }

  const handleDisconnectListUpdate = async() => {
    updateDisconnectListData = await {DisconnectList: updateDisconnectListData};
    try {
      const response = await setDisconnectListAPI(data.accountNum, updateDisconnectListData);
  
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
  
      const updatedDisconnectList = await response.json();
      setDisconnectListData(updatedDisconnectList);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleVesselEdit = async(index:any, newValue:any, valueType:String) => {
    switch(valueType) {
      case "PropertyOwner":
        updateDisconnectListData[index].PropertyOwner = `${newValue}`;
        break;
      case "Street":
        updateDisconnectListData[index].Street = `${newValue}`;
        break;
      case "City":
        updateDisconnectListData[index].City = `${newValue}`;
        break;
      case "State":
        updateDisconnectListData[index].State = `${newValue}`;
        break;
      case "Zip":
        updateDisconnectListData[index].Zip = `${newValue}`;
        break;
      case "Amount":
        updateDisconnectListData[index].Amount = `${newValue}`;
        break;
      case "Notes":
        updateDisconnectListData[index].Notes = `${newValue}`;
        break;
      default:
        console.log(`${ index } ${ newValue } ${ valueType }`);
        // code block
    } 
    setDisconnectListData(updateDisconnectListData);
  } 

  const handleSendError = async(index:number) => {
    const errorRow = document.getElementById(`${index}`);
    if(errorRow) {
      errorRow.setAttribute("background","red");
    }
  }
  
  const handleAddRow = async() => {
    const newObj = {"PropertyOwner": " ", "Street": " ", "City": " ", "State": " ", "Zip": " ", "Amount": " ", "Notes": " "};
    updateDisconnectListData[updateDisconnectListDataLength] = await newObj;
    console.log(updateDisconnectListData);
    updateDisconnectListDataLength ++; 
    handleDisconnectListUpdate();
  }
  
  const deleteRowHandler = (index:number) => { 
    updateDisconnectListData.splice(index, 1); 
    console.log(updateDisconnectListData);
    updateDisconnectListDataLength --;
    handleDisconnectListUpdate(); 
  }

  const saveAll = () => {
    for(let i = 0; i < disconnectListData.length; i++) {
      if(updateDisconnectListData.Notes == null || updateDisconnectListData.Amount == null) {
        handleSendError(i);
        break;
      }
    }
    handleDisconnectListUpdate(); 
    data.setEdit(false);
  }

  const rowStyles = {
    height: '100%',
    width: '100%',
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
            {Object.keys(updateDisconnectListData).map((index) => (tableBuilder(index)))}
          </tbody>
        </table> <br />
        <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
        <button onClick={saveAll} id="saveBtn">Save and View</button>
      </div>
    </>
  );
};

export default SetDisconnectList;