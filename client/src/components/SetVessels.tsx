import React, { useState, useEffect } from 'react';
import { getVesselsAPI, setVesselsAPI } from '../utils/API';

const SetVessels = ({accountNum}) => {
  const [vesselData, setVesselData] = useState({});

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
  }, [vesselDataLength]);
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  const handleVesselEdit = async() => {
    try {
      const response = await setVesselsAPI(accountNum);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedVessels = await response.json();
      setVesselData(updatedVessels);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRow = async() => {
  
  }
  
  const deleteRowHandler = async() => {
    
  }

  const noItems = `<p>There are no items to display!</p>`;

  return (
    <>
      <div>
        {vesselDataLength}
        {vesselDataLength ? 
        Object.keys(vesselData).map((index) => (
          <p>
            Vessel: <input type="text" placeholder={vesselData[index].Vessel} id={`vessel${index}`}></input> Owner: <input type="text" placeholder={vesselData[index].Person} id={`person${index}`}></input> <button onClick={deleteRowHandler} id={`deleteRow${index}`}>Delete Row</button>
          </p>
        )) : noItems}
        <button onClick={handleAddRow}>Add A Row</button>
        <button onClick={handleVesselEdit}>Save Edits</button>
      </div>
    </>
  );
};

export default SetVessels;