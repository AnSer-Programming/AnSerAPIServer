import React, { useState, useEffect } from 'react';
import { getVesselsAPI } from '../utils/API';

let accountNumPlaceHolder = null;

const GetVessels = (data:any) => {
  const [vesselData, setVesselData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;
  
  useEffect(() => {
    const getVesselData = async() => {
      try {
        accountNumPlaceHolder = data.accountNum;
        const response = await getVesselsAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        vessel.VesselsOwners = vessel.VesselsOwners.sort(((a:any, b:any) =>  a.Person.localeCompare(b.Person))).reverse();
        setVesselData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };

    getVesselData();
  }, [vesselDataLength, data.accountNum]);
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <p>*If your updates don't appear right away please refresh the page.</p>
      <table>
        <tbody>
          {Object.keys(vesselData).map((index) => (<tr><td style={{paddingRight: '25px'}}>Vessel: {vesselData[index].Vessel}</td> <td>Contact: {vesselData[index].Person}</td></tr>))}
        </tbody>
      </table>
    </>
  );
};

export default GetVessels;