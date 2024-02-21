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
        list.DisconnectList.sort((a:any, b:any) => (a.PropertyOwner < b.PropertyOwner ? -1 : 1));
    
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
          for(let i:number = list.DisconnectList.length-1; i > 0; i--) {
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
    function autoFill(field:string) {
      if(data.accountNum == 6509) {
        switch(field) {
          case "city":
            return "Plymouth";
          case "state":
            return "WI";
          case "zip":
            return "53073";
          default:
            break;
        }
      }
    }

    return (
      <>
        <tr key={`primaryRow${index}`} style={rowStyles}>
          <td key={`PropertyOwner${disconnectListData[index].PropertyOwner}${index}`} style={fieldStyles}>
            Property Owner: <br />
            <TextField 
              label={disconnectListData[index].PropertyOwner} 
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "propertyOwner");
              }} 
              id={`propertyOwner${index}`}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td key={`Street${disconnectListData[index].Street}${index}`} style={fieldStyles}>
            Street: <br />
            <TextField 
              label={disconnectListData[index].Street} 
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "Street");
              }} 
              id={`street${index}`}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td key={`City${disconnectListData[index].City}${index}`} style={fieldStyles}>
            City: <br />
            <TextField 
              label={disconnectListData[index].City} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "City");
              }} 
              value = {autoFill("city")}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" || data.accountNum == 6509 ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td key={`State${disconnectListData[index].State}${index}`} style={fieldStyles}>
            State: <br />
            <TextField 
              label={disconnectListData[index].State} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "State");
              }} 
              value = {autoFill("state")}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" || data.accountNum == 6509 ? { readOnly: true } : { readOnly: false }} />
          </td>
        </tr>
        <tr key={`secondaryRow${index}`} style={rowStyles}>
          <td key={`Zip${disconnectListData[index].Zip}${index}`} style={fieldStyles}>
            Zip: <br />
            <TextField 
              label={disconnectListData[index].Zip} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "Zip");
              }} 
              value = {autoFill("zip")}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" || data.accountNum == 6509 ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td key={`Amount${disconnectListData[index].Amount}${index}`} id={index} style={fieldStyles}>
            Amount: <br />
            <TextField 
              label={disconnectListData[index].Amount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "Amount");
              }} 
              id={`amount${index}`}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td key={`Notes${disconnectListData[index].Notes}${index}`} id={index} style={fieldStyles}>
            Notes: <br />
            <TextField 
              label={disconnectListData[index].Notes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVesselEdit(index, event.target.value, "Notes");
              }} 
              id={`notes${index}`}
              className={'bg-white'}
              sx={{ width: 250, zIndex: 0 }}
              variant="filled"
              InputProps={disconnectListData[index].PropertyOwner == "Unlisted" ? { readOnly: true } : { readOnly: false }} />
          </td>
          <td style={fieldStyles}>
            <br /><button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`} style={{height: '65%', width: '100%', alignSelf: 'baseline'}}>Delete Listing</button>
          </td>
        </tr>
        <tr key={`gapRow${ index }`} style={{borderBottom: '2px solid', borderColor: '#54B4D3', height: '15px'}} className='bg-info'></tr>
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
    let classOptions:String[];
    const ownerElement = document.getElementById("propertyOwner"+index);
    const streetElement = document.getElementById("street"+index);
    const amountElement = document.getElementById("amount"+index);
    const notesElement = document.getElementById("notes"+index);

    switch(valueType) {
      case "propertyOwner":
        updateDisconnectListData[index].PropertyOwner = `${newValue}`;
        if(ownerElement) {
          if(ownerElement.parentElement) {
            if(ownerElement.parentElement.parentElement) {
              classOptions = ownerElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-danger') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              ownerElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      case "Street":
        updateDisconnectListData[index].Street = `${newValue}`;
        if(streetElement) {
          if(streetElement.parentElement) {
            if(streetElement.parentElement.parentElement) {
              classOptions = streetElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-danger') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              streetElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
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
        if(amountElement) {
          if(amountElement.parentElement) {
            if(amountElement.parentElement.parentElement) {
              classOptions = amountElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-warning') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              amountElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        if(notesElement) {
          if(notesElement.parentElement) {
            if(notesElement.parentElement.parentElement) {
              classOptions = notesElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-warning') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              notesElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      case "Notes":
        updateDisconnectListData[index].Notes = `${newValue}`;
        if(amountElement) {
          if(amountElement.parentElement) {
            if(amountElement.parentElement.parentElement) {
              classOptions = amountElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i > classOptions.length; i++) {
                if(classOptions[i] === 'bg-warning') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              amountElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        if(notesElement) {
          if(notesElement.parentElement) {
            if(notesElement.parentElement.parentElement) {
              classOptions = notesElement.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-warning') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-white';
              notesElement.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      default:
        // console.log(`${ index } ${ newValue } ${ valueType }`);
        // code block
    } 
    setDisconnectListData(updateDisconnectListData);
  } 

  const handleSendError = async(index:number, option:String) => {
    let classOptions:String[];
    const errorOwner = document.getElementById("propertyOwner"+index);
    const errorStreet = document.getElementById("street"+index);
    const errorAmount = document.getElementById("amount"+index);
    const errorNotes = document.getElementById("notes"+index);

    switch(option) {
      case "amountNotes":
        if(errorAmount) {
          if(errorAmount.parentElement) {
            if(errorAmount.parentElement.parentElement) {
              classOptions = errorAmount.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-white') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-warning';
              errorAmount.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        if(errorNotes) {
          if(errorNotes.parentElement) {
            if(errorNotes.parentElement.parentElement) {
              classOptions = errorNotes.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-white') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-warning';
              errorNotes.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      case "propertyOwner":
        if(errorOwner) {
          if(errorOwner.parentElement) {
            if(errorOwner.parentElement.parentElement) {
              classOptions = errorOwner.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-white') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-danger';
              errorOwner.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      case "street":
        if(errorStreet) {
          if(errorStreet.parentElement) {
            if(errorStreet.parentElement.parentElement) {
              classOptions = errorStreet.parentElement.parentElement.className.split(" ");
              for(let i = 0; i < classOptions.length; i++) {
                if(classOptions[i] === 'bg-white') {
                  classOptions.splice(i, 1);
                }
              }
    
              classOptions[classOptions.length-1] = 'bg-danger';
              errorStreet.parentElement.parentElement.className = classOptions.toString().replace(/,/g, " ");
            }
          }
        }
        break;
      default:
        
    }    
  }
  
  const handleAddRow = async() => {
    const newObj = {"PropertyOwner": " ", "Street": " ", "City": " ", "State": " ", "Zip": " ", "Amount": " ", "Notes": " "};
    updateDisconnectListData[updateDisconnectListDataLength] = await newObj;
    updateDisconnectListDataLength ++; 
    handleDisconnectListUpdate();
  }
  
  const deleteRowHandler = (index:number) => { 
    updateDisconnectListData.splice(index, 1); 
    updateDisconnectListDataLength --;
    handleDisconnectListUpdate(); 
  }

  const saveAll = () => {
    let error:boolean = false;
    for(let i = 0; i < updateDisconnectListData.length; i++) {
      if(!updateDisconnectListData[i].Amount || updateDisconnectListData[i].Amount == " " || updateDisconnectListData[i].Amount.length === 0) {
        if(!updateDisconnectListData[i].Notes || updateDisconnectListData[i].Notes == " " || updateDisconnectListData[i].Notes.length === 0) {
          error = true;
          handleSendError(i, 'amountNotes');
        }
      }
      if(!updateDisconnectListData[i].PropertyOwner || updateDisconnectListData[i].PropertyOwner === " " || updateDisconnectListData[i].PropertyOwner.length === 0) {
        error = true;
        handleSendError(i, 'propertyOwner');
      }
      if(!updateDisconnectListData[i].Street || updateDisconnectListData[i].Street === " " || updateDisconnectListData[i].Street.length === 0) {
        error = true;
        handleSendError(i, 'street');
      }
    } 
    if(!error) {
      handleDisconnectListUpdate(); 
      data.setEdit(false);
    }
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
        <table key="SetDisconnectListTable">
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