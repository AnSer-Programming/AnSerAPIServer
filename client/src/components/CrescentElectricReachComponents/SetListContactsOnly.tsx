import React from 'react';
import { useState, useEffect } from 'react';
import { getReachList, updateReachList } from '../../utils/API';
import SetContact from './SetContact';

const SetList = (data: any) => {
  const [reachListData, setReachListData] = useState<any>({});
  const [option, setOptions] = useState<String[]>([]);
  const [updatedContacts, setUpdatedContacts] = useState<any>();
  const [errorStatement, setErrorStatement] = useState<String>();

  // use this to determine if `useEffect()` hook needs to run again
  const reachListDataLength = Object.keys(reachListData).length;

  useEffect(() => {
    const getReachListData = async () => {
      try {
        const response = await getReachList();
        let options = new Array();
        options[0] = "No Emergency Service";
        options[1] = "Branch Closed";
        options[2] = "Branch Closed - Calls go to branch#";
        for (let i = 0; i < data.options.length; i++) {
          options[i + 3] = data.options[i];
        }

        setOptions(options);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let reachList = await response.json();
        setReachListData(reachList);
      } catch (err) {
        console.error(err);
      }
    };

    getReachListData();
  }, [reachListDataLength, errorStatement]);

  if (!reachListDataLength) {
    return <h2>LOADING...</h2>;
  }

  const handleContactEdit = async(index: number, value: string, field: string) => {
    console.log(`${index}, ${value}, ${field}`);
    console.log(updatedContacts);
    let placeHolder:any = new Array();
    let isFound:boolean = false;
    if(updatedContacts) {
      placeHolder = updatedContacts;
      for(let i = 0; i < updatedContacts.length; i++) {
        if(placeHolder[i].id == index) {
          placeHolder[i][`${field}`] = `${value}`;
          setUpdatedContacts(placeHolder);
          isFound = true;
        }
        if(!isFound && i == updatedContacts.length-1) {
          placeHolder[i+1] = {id: index};
          placeHolder[i+1][`${field}`] = `${value}`;
          setUpdatedContacts(placeHolder);
        }
      }
    } else {
      placeHolder = [{id: index}];
      placeHolder[0][`${field}`] = `${value}`;
      setUpdatedContacts(placeHolder);
    }
    console.log(updatedContacts);
  }

  const saveHandler = () => {
    if(updatedContacts) {
      for(let i = 0; i < updatedContacts.length; i++) {
        updateReachList(updatedContacts[i].id, updatedContacts[i]);
      }
    }
    data.setEdit();
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td key={`branch`} style={{ paddingRight: '25px' }}>Branch</td>
            <td key={`state`} style={{ paddingRight: '25px' }}>State</td>
            <td key={`city`} style={{ paddingRight: '25px' }}>City</td>
            <td key={`primary_contact`}>Primary Contact</td>
            <td key={`secondary_contact`}>Second Contact</td>
            <td key={`tertiary_contact`}>Third Contact</td>
            <td key={`quaternary_contact`}>Fourth Contact</td>
          </tr>
        </thead>
        <tbody key="TableBody">
          {Object.keys(reachListData).map((index) => (
            <tr key={`row${index}`}>
              <td key={`${reachListData[index].branch}Row${index}Branch`} style={{ paddingRight: '25px' }}>{reachListData[index].branch}</td>
              <td key={`${reachListData[index].state}Row${index}State`} style={{ paddingRight: '25px' }}>{reachListData[index].state}</td>
              <td key={`${reachListData[index].city}Row${index}City`} style={{ paddingRight: '25px' }}>{reachListData[index].city}</td>
              <td key={`${reachListData[index].primary_contact}Row${index}Primary`}>
                <SetContact
                  label = {reachListData[index].primary_contact ? `${reachListData[index].primary_contact}` : `Primary Contact`}
                  key={`Row${index}PrimaryContact`}
                  i={reachListData[index].id}
                  contact_name={reachListData[index].primary_contact}
                  contactEdit={(i: number, value: string) => handleContactEdit(i, value, "primary_contact")}
                  options={option} /></td>
              <td key={`${reachListData[index].secondary_contact}Row${index}Secondary`}>
                <SetContact
                  label = {reachListData[index].secondary_contact ? `${reachListData[index].secondary_contact}` : `Secondary Contact`}
                  key={`Row${index}SecondaryContact`}
                  i={reachListData[index].id}
                  contact_name={reachListData[index].secondary_contact}
                  contactEdit={(i: number, value: string) => handleContactEdit(i, value, "secondary_contact")}
                  options={option} /></td>
              <td key={`${reachListData[index].tertiary_contact}Row${index}Tertiary`}>
                <SetContact
                  label = {reachListData[index].tertiary_contact ? `${reachListData[index].tertiary_contact}` : `Tertiary Contact`}
                  key={`Row${index}TertiaryContact`}
                  i={reachListData[index].id}
                  contact_name={reachListData[index].tertiary_contact}
                  contactEdit={(i: number, value: string) => handleContactEdit(i, value, "tertiary_contact")}
                  options={option} /></td>
              <td key={`${reachListData[index].quaternary_contact}Row${index}Quaternary`}>
                <SetContact
                  label = {reachListData[index].quaternary_contact ? `${reachListData[index].quaternary_contact}` : `Quaternary Contact`}
                  key={`Row${index}QuaternaryContact`}
                  i={reachListData[index].id}
                  contact_name={reachListData[index].quaternary_contact}
                  contactEdit={(i: number, value: string) => handleContactEdit(i, value, "quaternary_contact")}
                  options={option} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{errorStatement}</p>
      <button onClick={() => saveHandler()}>Save All Contact Updates</button>
    </>
  );
};

export default SetList;