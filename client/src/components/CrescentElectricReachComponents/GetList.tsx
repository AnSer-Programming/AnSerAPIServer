import React, { useState, useEffect } from 'react';
import { getReachList } from '../../utils/API';

const GetList = () => {
  const [reachListData, setReachListData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const reachListDataLength = Object.keys(reachListData).length;
  
  useEffect(() => {
    const getReachListData = async() => {
      try {
        const response = await getReachList();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let vessel = await response.json();
        setReachListData(vessel);
      } catch (err) {
        console.error(err);
      }
    };

    getReachListData();
  }, [reachListDataLength]);
  
  if (!reachListDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
              <td key={`branch`} style={{paddingRight: '25px'}}>Branch</td>
              <td key={`state`} style={{paddingRight: '25px'}}>State</td>
              <td key={`city`} style={{paddingRight: '25px'}}>City</td>
              <td key={`primary_contact`} style={{paddingRight: '25px'}}>Primary Contact</td>
              <td key={`secondary_contact`} style={{paddingRight: '25px'}}>Second Contact</td>
              <td key={`tertiary_contact`} style={{paddingRight: '25px'}}>Third Contact</td>
              <td key={`quaternary_contact`}>Fourth Contact</td>
          </tr>
        </thead>
        <tbody key="TableBody">
          {Object.keys(reachListData).map((index) => (
            <tr key={`row${index}`}>
              <td key={`${reachListData[index].branch}Row${index}`} style={{paddingRight: '25px'}}>{reachListData[index].branch}</td>
              <td key={`${reachListData[index].state}Row${index}`} style={{paddingRight: '25px'}}>{reachListData[index].state}</td>
              <td key={`${reachListData[index].city}Row${index}`} style={{paddingRight: '25px'}}>{reachListData[index].city}</td>
              <td key={`${reachListData[index].primary_contact}Row${index}Primary`} style={{paddingRight: '25px'}}>
                {reachListData[index].primary_contact ? reachListData[index].primary_contact : "No Primary Contact"}
              </td>
              <td key={`${reachListData[index].secondary_contact}Row${index}Secondary`} style={{paddingRight: '25px'}}>
                {reachListData[index].secondary_contact ? reachListData[index].secondary_contact : "No Secondary Contact"}
              </td>
              <td key={`${reachListData[index].tertiary_contact}Row${index}Tertiary`} style={{paddingRight: '25px'}}>
                {reachListData[index].tertiary_contact ? reachListData[index].tertiary_contact : "No Tertiary Contact"}
              </td>
              <td key={`${reachListData[index].quaternary_contact}Row${index}Quaternary`}>
                {reachListData[index].quaternary_contact ? reachListData[index].quaternary_contact : "No Quaternary Contact"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetList;