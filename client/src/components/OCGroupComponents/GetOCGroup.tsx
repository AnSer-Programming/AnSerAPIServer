import React, { useState, useEffect } from 'react';
import { getOCGroupAPI } from '../../utils/API';

let accountNumPlaceHolder = null;

const GetOCGroup = (data:any) => {
  const [onCallGroupData, setOCGroupData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const onCallGroupDataLength = Object.keys(onCallGroupData).length;
  let placeHolder:{};
  
  useEffect(() => {
    const getOCGroupData = async() => {
      try {
        accountNumPlaceHolder = data.accountNum;
        const response = await getOCGroupAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let onCallGroup = await response.json();
        
        setOCGroupData(onCallGroup);
      } catch (err) {
        console.error(err);
      }
    };

    getOCGroupData();
  }, [onCallGroupDataLength, data.accountNum]);
  
  if (!onCallGroupDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody key="TableBody">
          {Object.keys(onCallGroupData).map((index) => (
            <tr key={`row${index}`}>
              <td key={onCallGroupData[index].facility} style={{paddingRight: '25px'}}>Facility: {onCallGroupData[index].facility}</td>
              <td key={onCallGroupData[index].facility+"_"+"InPatient"+onCallGroupData[index].in_patient} style={{paddingRight: '25px'}} >In Patient OC Group: {onCallGroupData[index].in_patient ? onCallGroupData[index].in_patient : "No In Patient Coverage"}</td>
              <td key={onCallGroupData[index].facility+"_"+"OutPatient"+onCallGroupData[index].out_patient} >Out Patient OC Group: {onCallGroupData[index].out_patient ? onCallGroupData[index].out_patient : "No Out Patient Coverage"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetOCGroup;