import React, { useState, useEffect } from 'react';
import { getVesselsDBAPI } from '../../utils/API';

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
        const response = await getVesselsDBAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        console.log(vessel);
        vessel = vessel.sort(((a:any, b:any) =>  a.contact_name.localeCompare(b.contact_name))).reverse();
    
        if(data.accountNum == 38 || data.accountNum == 6071) {
            for(var i:number = 0; i < vessel.length; i++) {
                if(vessel[i].vessel_name == "Unlisted") {
                    if(vessel[i].contact_name != "Misc") {
                      vessel[i].contact_name = "Misc";
                    }
                    if(i < vessel.length) {
                        placeHolder = vessel[i];
                        vessel.splice(i, 1);
                        vessel[vessel.length] = placeHolder;
                    }
                    break;
                } else {
                    if(vessel.length == i) {
                      vessel[i] = {vessel_name: "Unlisted", contact_name: "Misc"};
                    }
                }
            }
        } //list, blank, then Unlisted
    
        if(data.accountNum == 38 || data.accountNum == 6071) {
          for(var i:number = vessel.length-1; i > 0; i--) {
            if(vessel[i].vessel_name == "Unlisted") {
              if(vessel[i-1].Vessel == " ") {
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

    getVesselData();
  }, [vesselDataLength, data.accountNum]);
  
  if (!vesselDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody key="TableBody">
          {Object.keys(vesselData).map((index) => (
            <tr key={`row${index}`}>
              <td key={vesselData[index].vessel_name} style={{paddingRight: '25px'}}>Vessel: {vesselData[index].vessel_name}</td>
              <td key={vesselData[index].contact_name} >Contact: {vesselData[index].contact_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetVessels;