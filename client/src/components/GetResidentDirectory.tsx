import React, { useState, useEffect } from 'react';
import { getResidentDirectoryAPI } from '../utils/API';

let accountNumPlaceHolder = null;

const GetResidentDirectory = (data:any) => {
  const [residentDirectoryData, setResidentDirectoryData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const residentDirectoryDataLength = Object.keys(residentDirectoryData).length;
  let placeHolder:{};
  
  useEffect(() => {
    const getResidentDirectoryData = async() => {
      try {
        accountNumPlaceHolder = data.accountNum;
        const response = await getResidentDirectoryAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        setResidentDirectoryData(vessel.VesselsOwners);
      } catch (err) {
        console.error(err);
      }
    };

    getResidentDirectoryData();
  }, [residentDirectoryDataLength, data.accountNum]);
  
  if (!residentDirectoryDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody>
          {Object.keys(residentDirectoryData).map((index) => (
            <tr key={`row${index}`}>
              <td key={residentDirectoryData[index].Vessel} style={{paddingRight: '25px'}}>Vessel: {residentDirectoryData[index].Vessel}</td>
              <td key={residentDirectoryData[index].Person} >Contact: {residentDirectoryData[index].Person}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetResidentDirectory;