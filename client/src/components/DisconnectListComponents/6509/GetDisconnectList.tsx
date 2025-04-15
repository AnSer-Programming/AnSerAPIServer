import React, { useState, useEffect } from 'react';
import { getDisconnectListAPI } from '../../../utils/API';

let accountNumPlaceHolder = null;

const GetDisconnectList = (data:any) => {
  const [disconnectListData, setDisconnectListData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const disconnectListDataLength = Object.keys(disconnectListData).length;
  let placeHolder:{};
  
  useEffect(() => {
    const getDisconnectListData = async() => {
      try {
        accountNumPlaceHolder = data.accountNum;
        const response = await getDisconnectListAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let list = await response.json();
        list.DisconnectList.sort((a:any, b:any) => (a.PropertyOwner < b.PropertyOwner ? -1 : 1));
    
        if(data.accountNum == 38 || data.accountNum == 6509) {
            for(var i:number = 0; i < list.DisconnectList.length; i++) {
                if(list.DisconnectList[i].PropertyOwner == "Unlisted") {
                    if(i < list.DisconnectList.length) {
                        placeHolder = list.DisconnectList[i];
                        list.DisconnectList.splice(i, 1);
                        list.DisconnectList[list.DisconnectList.length] = placeHolder; 
                    }
                    break;
                } else {
                    if(list.DisconnectList.length == i) {
                      list.DisconnectList[i] = {PropertyOwner: "Unlisted"};
                    }
                }
            }
        } //list, blank, then Unlisted
    
        if(data.accountNum == 38 || data.accountNum == 6509) {
          for(var i:number = list.DisconnectList.length-1; i > 0; i--) {
            if(list.DisconnectList[i].PropertyOwner == "Unlisted") {
              if(list.DisconnectList[i-1].PropertyOwner == " ") {
                placeHolder = list.DisconnectList[i];
                list.DisconnectList[i] = list.DisconnectList[i-1];
                list.DisconnectList[i-1] = placeHolder;
              }
            }
          }
        } // list, unlisted, then blank
        setDisconnectListData(list.DisconnectList);
      } catch (err) {
        console.error(err);
      }
    };

    getDisconnectListData();
  }, [disconnectListDataLength, data.accountNum]);
  
  if (!disconnectListDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody>
          {Object.keys(disconnectListData).map((index) => (
            <tr key={`row${index}`}>
              <td key={`PropertyOwner${disconnectListData[index].PropertyOwner}${index}`} style={{paddingRight: '25px'}}>Property Owner: {disconnectListData[index].PropertyOwner}</td>
              <td key={`Street${disconnectListData[index].Street}${index}`} style={{paddingRight: '25px'}} >Street: {disconnectListData[index].Street}</td>
              <td key={`City${disconnectListData[index].City}${index}`} style={{paddingRight: '25px'}} >City: {disconnectListData[index].City}</td>
              <td key={`State${disconnectListData[index].State}${index}`} style={{paddingRight: '25px'}} >State: {disconnectListData[index].State}</td>
              <td key={`Zip${disconnectListData[index].Zip}${index}`} style={{paddingRight: '25px'}} >Zip: {disconnectListData[index].Zip}</td>
              <td key={`Amount${disconnectListData[index].Amount}${index}`} style={{paddingRight: '25px'}} >Amount: {disconnectListData[index].Amount}</td>
              <td key={`Notes${disconnectListData[index].Notes}${index}`} style={{paddingRight: '25px'}} >Note: {disconnectListData[index].Notes}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetDisconnectList;