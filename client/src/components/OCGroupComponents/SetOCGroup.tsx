import React from 'react';
import { useState, useEffect } from 'react';
import { getOCGroupAPI, updateOCGroupAPI } from '../../utils/API';
import OCGroupAutoFill from './OCGroupAutoFill';
import { Json } from 'mailgun.js';

const SetOCGroup = (data: any) => {
  const [onCallGroupData, setOCGroupData] = useState<any>({});
  const [option, setOptions] = useState<string[]>([]);
  let updateOnCallGroupData: any = {};
  const onCallGroupDataLength = Object.keys(onCallGroupData).length;
  let updateOnCallGroupDataLength: number = updateOnCallGroupData.length;
  let placeHolder: {};

  const getOCGroups = () => {
    let contactsArray = ['No Coverage', 'B', 'C', 'B & C', 'D'];

    return contactsArray;
  }

  const getOCGroupData = async () => {
    try {
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

  useEffect(() => {
    const options = async () => {
      switch (data.accountNum) {
        case '38':
          setOptions((["Adam Jeanquart", "Billy Palmer", "Cristian Mueller", "Sam Cloyd", "Stephen Merki"]).sort());
          break;
        case '44233':
          setOptions(getOCGroups());
          break;
        default:
          setOptions(getOCGroups());
          break;
      }
    };

    options();
    getOCGroupData();
  }, [onCallGroupDataLength, data.accountNum]); // If either the amount of data being received changes or if the account number changes the useEffect will run

  if (!onCallGroupDataLength) {
    return <h2>LOADING...</h2>;
  }

  function tableBuilder() {
    let rows = new Array(onCallGroupDataLength);

    for (let i = 0; i < onCallGroupDataLength; i++) {
      rows.push(
        <tr key={`row${i}`} style={rowStyles}>
          <td>Facility: {onCallGroupData[i].facility}</td>
          <OCGroupAutoFill
            i={i}
            facility={onCallGroupData[i].facility}
            on_call_group_name="In Patient"
            on_call_group={onCallGroupData[i].in_patient}
            onCallGroupEdit={(i: number, value: string) => handleOnCallGroupEdit(i, value, "in_patient")}
            options={option} />
          <OCGroupAutoFill
            i={i}
            facility={onCallGroupData[i].facility}
            on_call_group_name="Out Patient"
            on_call_group={onCallGroupData[i].out_patient}
            onCallGroupEdit={(i: number, value: string) => handleOnCallGroupEdit(i, value, "out_patient")}
            options={option} />
        </tr>
      )
    }

    return rows;
  }

  const handleOnCallGroupEdit = async (i: any, newValue: any, valueType: String) => {
    let data = {};
    data = {[`${valueType}`]: newValue};
    updateOCGroupAPI(`${onCallGroupData[i].id}`, data);
  }

  const saveAll = () => {
    data.setEdit(false);
  }

  const rowStyles = {
    height: '100%',
    width: '75%',
  }

  return (
    <>
      <div>
        <table>
          <tbody key="TableBody">
            {tableBuilder()}
          </tbody>
        </table> <br />
        <button onClick={saveAll} id="saveBtn">Save and View</button>
      </div>
    </>
  );
};

export default SetOCGroup;