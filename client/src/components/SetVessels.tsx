import React, { useState, useEffect } from 'react';
import { getVesselsAPI, setVesselsAPI } from '../utils/API';

const SetVessels = ({accountNum}) => {
  const [vesselData, setVesselData] = useState([]);
  let updateVesselData:any = vesselData;
  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;

  useEffect(() => {
    const getVesselData = async() => {
      try {
        const response = await getVesselsAPI(accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const vessel = await response.json();
        setVesselData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };

    getVesselData();
  }, [vesselDataLength, accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  let updateVesselDataLength = vesselDataLength;
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

  const handleVesselEdit = async() => {
    const elementsLength:number = document.getElementsByClassName("Vessels").length;
    const vessels:any = document.getElementsByClassName("Vessels");
    const people:any = document.getElementsByClassName("Person");
    for(let i = 0; i < elementsLength; i++) {
      if(vessels[i].value != "") {
        if(people[i].value != "") {
          updateVesselData[i] = {"Vessel": `${vessels[i].value}`, "Owner": `${people[i].value}`}
        } else {
          updateVesselData[i] = {"Vessel": `${vessels[i].value}`, "Owner": `${people[i].placeholder}`}
        }
      } else {
        if(people[i].value != "") {
          updateVesselData[i] = {"Vessel": `${vessels[i].placeholder}`, "Owner": `${people[i].value}`}
        } else {
          updateVesselData[i] = {"Vessel": `${vessels[i].placeholder}`, "Owner": `${people[i].placeholder}`}
        }
      }
    }
    handleVesselUpdate();
  } 

  const handleAddRow = async() => {
    const newObj = {"Vessel": " ", "Owner": " "};
    updateVesselData[updateVesselDataLength] = await newObj;
    updateVesselDataLength +=1;
    handleVesselUpdate(); 
  }
  
  const deleteRowHandler = (index:number) => {
    updateVesselData.splice(index, 1);
    handleVesselUpdate();
  }

  const noItems = `<p>There are no items to display!</p>`;
  
  return (
    <>
      <div>
        {
          vesselDataLength ? 
          Object.keys(vesselData).map((index) => (
            <p>
              Vessel: <input type="text" placeholder={vesselData[index].Vessel} id={`vessel${index}`} className='Vessels'></input> Owner: <input type="text" placeholder={vesselData[index].Person} id={`person${index}`} className='Person'></input> <button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`}>Delete Row</button>
            </p>
            ),
          ) : noItems
        }
        <button onClick={handleAddRow} id="newRow">Add A Blank Row</button>
        <button onClick={handleVesselEdit}>Save All Edits</button>
      </div>
    </>
  );
};

export default SetVessels;