import React from 'react';
import { useState, useEffect } from 'react';
// import { getVesselsDBAPI, setVesselsDBAPI, updateVesselsDBAPI, deleteVesselsDBAPI } from '../../utils/API';
import { postToReachList } from '../../utils/API';
import SetBranchInfo from './SetBranchInfo';
import SetContact from './SetContact';

const SetListContactsAndBranchInfo = (data: any) => {
  const [option, setOptions] = useState<String[]>([]);
  const [branch, setBranch] = useState<number>();
  const [city, setCity] = useState<String>();
  const [state, setState] = useState<String>();
  const [primaryContact, setPrimaryContact] = useState<String>();
  const [secondaryContact, setSecondaryContact] = useState<String>();
  const [tertiaryContact, setTertiaryContact] = useState<String>();
  const [quaternaryContact, setQuaternaryContact] = useState<String>();
  const [errorStatement, setErrorStatement] = useState<String>();

  // use this to determine if `useEffect()` hook needs to run again

  useEffect(() => {
    const getReachListData = async () => {
      try {
        let options = new Array();
        options[0] = "No Emergency Service";
        options[1] = "Branch Closed";
        options[2] = "Branch Closed - Calls go to a different Branch";
        for (let i = 0; i < data.options.length; i++) {
          options[i + 3] = data.options[i];
        }

        setOptions(options);
      } catch (err) {
        console.error(err);
      }
    };

    getReachListData();
  }, []);

  const handleEdit = (index: number, value: string, field: string) => {
    console.log(`${index}, ${value}, ${field}`);
    switch (field) {
      case "branch":
        setBranch(parseInt(value));
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "primary_contact":
        setPrimaryContact(value);
        break;
      case "secondary_contact":
        setSecondaryContact(value);
        break;
      case "tertiary_contact":
        setTertiaryContact(value);
        break;
      case "quaternary_contact":
        setQuaternaryContact(value);
        break;
      default:
        break;
    }
  }

  const saveHandler = async () => {
    let saveCheck: boolean[] = new Array();
    let errorStatementHolder: String = "";
    setErrorStatement("");
    saveCheck = [false, false, false];
    if (branch) {
      saveCheck[0] = true;
    } else {
      if (errorStatementHolder) {
        errorStatementHolder = `${errorStatementHolder}, Missing Branch Number`;
      } else {
        errorStatementHolder = `Missing Branch Number`;
      }
    }

    if (city) {
      saveCheck[1] = true;
    } else {
      if (errorStatementHolder) {
        errorStatementHolder = `${errorStatementHolder}, Missing City`;
      } else {
        errorStatementHolder = `Missing City`;
      }
    }

    if (state) {
      saveCheck[2] = true;
    } else {
      if (errorStatementHolder) {
        errorStatementHolder = `${errorStatementHolder}, Missing State`;
      } else {
        errorStatementHolder = `Missing State`;
      }
    }

    setErrorStatement(errorStatementHolder);

    if (saveCheck[0] && saveCheck[1] && saveCheck[2]) {
      const branchData = {
        branch: `${branch}`,
        city: `${city}`,
        state: `${state}`,
        primary_contact: '',
        secondary_contact: '',
        tertiary_contact: '',
        quaternary_contact: ''
      };

      if (primaryContact) {
        branchData.primary_contact = `${primaryContact}`;
      }

      if (secondaryContact) {
        branchData.secondary_contact = `${secondaryContact}`;
      }

      if (tertiaryContact) {
        branchData.tertiary_contact = `${tertiaryContact}`;
      }

      if (quaternaryContact) {
        branchData.quaternary_contact = `${quaternaryContact}`;
      }

      postToReachList(branchData);

      data.setEdit();
    }
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
          <tr key={`row0`}>
            <td key={`branchNumber`}>
              <SetBranchInfo
                label="Branch Number"
                i={0}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "branch")}
                key={`BranchField`} /></td>
            <td key={`state`}>
              <SetBranchInfo
                label="State"
                i={0}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "state")}
                key={`StateField`} /></td>
            <td key={`city`}>
              <SetBranchInfo
                label="City"
                i={0}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "city")}
                key={`CityField`} /></td>
            <td key={`primaryContact`}>
              <SetContact
                key={`PrimaryContact`}
                i={0}
                label={"Primary Contact"}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "primary_contact")}
                options={option} /></td>
            <td key={`secondaryContact`}>
              <SetContact
                key={`SecondaryContact`}
                i={0}
                label={"Secondary Contact"}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "secondary_contact")}
                options={option} /></td>
            <td key={`tertiaryContact`}>
              <SetContact
                key={`TertiaryContact`}
                i={0}
                label={"Tertiary Contact"}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "tertiary_contact")}
                options={option} /></td>
            <td key={`quaternaryContact`}>
              <SetContact
                key={`QuaternaryContact`}
                i={0}
                label={"Quaternary Contact"}
                contactEdit={(i: number, value: string) => handleEdit(i, value, "quaternary_contact")}
                options={option} /></td>
          </tr>
        </tbody>
      </table> <br />
      <p>{errorStatement}</p>
      <button onClick={saveHandler}>Save New Branch</button>
    </>
  );
};

export default SetListContactsAndBranchInfo;