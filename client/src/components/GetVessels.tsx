import React, { useState, useEffect } from 'react';
import { getVesselsAPI } from '../utils/API';

let accountNumPlaceHolder = null;

const GetVessels = ({accountNum}) => {
  const [vesselData, setVesselData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;
  
  useEffect(() => {
    const getVesselData = async() => {
      try {
        accountNumPlaceHolder = accountNum;
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

  return (
    <>
      <div>
        {Object.keys(vesselData).map((index) => (<p>Vessel: {vesselData[index].Vessel} | Owner: {vesselData[index].Person}</p>))}
      </div>
    </>
  );
};

export default GetVessels;