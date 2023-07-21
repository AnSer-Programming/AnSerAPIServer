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
  }, [vesselDataLength, accountNum]);
  
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
    // updateVesselData
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
    console.log(updateVesselData);
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
              Vessel: <input type="text" placeholder={vesselData[index].Vessel} id={`vessel${index}`}></input> Owner: <input type="text" placeholder={vesselData[index].Person} id={`person${index}`}></input> <button onClick={() => deleteRowHandler(parseInt(index))} id={`${index}`}>Delete Row</button>
            </p>
            ),
          ) : noItems
        }
        <button onClick={handleAddRow} id="newRow">Add A Row</button>
        <button onClick={handleVesselEdit}>Save Edits</button>
      </div>
    </>
  );
};

export default SetVessels;