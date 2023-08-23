import React, { useState, useEffect } from 'react';
import { getVesselsAPI } from '../utils/API';

let accountNumPlaceHolder = null;

const GetVessels = (data:any) => {
  const [vesselData, setVesselData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const vesselDataLength = Object.keys(vesselData).length;
  let placeHolder:{};
  
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

    getVesselData();
  }, [vesselDataLength, data.accountNum]);
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody>
          {Object.keys(vesselData).map((index) => (<tr key={`row${index}`}><td key={vesselData[index].Vessel} style={{paddingRight: '25px'}}>Vessel: {vesselData[index].Vessel}</td><td key={vesselData[index].Person} >Contact: {vesselData[index].Person}</td></tr>))}
        </tbody>
      </table>
    </>
  );
};

export default GetVessels;