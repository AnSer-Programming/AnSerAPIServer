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

        let vessel = await response.json();
        vessel.VesselsOwners = vessel.VesselsOwners.sort(((a, b) =>  a.Person.localeCompare(b.Person)));
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
      <table>
        <tbody>
          {Object.keys(vesselData).map((index) => (<tr><td style={{paddingRight: '25px'}}>Vessel: {vesselData[index].Vessel}</td> <td>Contact: {vesselData[index].Person}</td></tr>))}
        </tbody>
      </table>
    </>
  );
};

export default GetVessels;