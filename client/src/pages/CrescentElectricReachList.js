import {React, useState, useEffect} from 'react';
import GetReachList from '../components/CrescentElectricReachComponents/GetList';
import SetReachListContactsOnly from '../components/CrescentElectricReachComponents/SetListContactsOnly';
import SetReachListAddBranch from '../components/CrescentElectricReachComponents/SetListAddBranch';
import { getContactsDirectoriesByDirectory } from '../utils/GetDataAPI'
// import VesselListWalkThrough from '../components/WalkThrough/VesselList.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';

const CrescentElectricReachList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editChoice, setEditChoice] = useState("");
  const [accountNum, setAccountNum] = useState(0);
  const [directoryContacts, setContacts] = useState();
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  useEffect(() => {
    const getContactList = async() => {
      const response = await getContactsDirectoriesByDirectory(88949);
      let contacts = await response.json();
      let placeHolderArray = new Array();

      for(let i = 0; i < contacts.length; i++) {
        placeHolderArray[i] = await contacts[i].Field.trim();
      }
      
      setContacts(placeHolderArray);
    }

    getContactList();
  }, [])

  const walkThroughDisplay = () => {
    // return(<VesselListWalkThrough />);
  }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ? 
          <div> {{
              contactsOnly: <div>
                <button onClick={editingHandlerContactsOnly}>{isEdit ? editingEnabled : editingDisabled}</button><br /><br /> 
                <SetReachListContactsOnly
                  setEdit = {() => setIsEdit(false)}
                  options = {directoryContacts} />
              </div>, 
              addBranch: <div>
                <button onClick={editingHandlerAddBranch}>{isEdit ? editingEnabled : editingDisabled}</button><br /><br /> 
                <SetReachListAddBranch
                  setEdit = {() => setIsEdit(false)}
                  options = {directoryContacts} />
              </div>
            }[editChoice] 
          }
          </div>: 
          <div> 
            <button onClick={editingHandlerContactsOnly}>{isEdit ? editingEnabled : "Edit Contacts"}</button> &nbsp;
            <button onClick={editingHandlerAddBranch}>{isEdit ? editingEnabled : "Add a Branch"}</button><br /><br /> 
            <GetReachList />
          </div>
        } 
      </>
    )
  }

  const handlerChangeAccount = (event) => {
    setAccountNum(event.value);
  }

  const editingHandlerAddBranch = () => {
    if(isEdit){
      setIsEdit(false);
      setEditChoice("");
    }else{
      setIsEdit(true);
      setEditChoice("addBranch");
    }
  }

  const editingHandlerContactsOnly = () => {
    if(isEdit){
      setIsEdit(false);
      setEditChoice("");
    }else{
      setIsEdit(true);
      setEditChoice("contactsOnly");
    }
  }

  const option = [
    {value: '0', label: 'Walk-Through'},
    {value: '88949', label: 'Account 88949: Crescent Electric'}
  ];

  return (
    <>
      <Menu 
        page="Crescent Electric Reach List" />
      <div className='text-light bg-dark pt-5' style={{width: '100%', paddingLeft: '5px', paddingRight: '5px'}}>
        <div style={{width: '50%', marginLeft: '5px'}}>
          <Select
            className='text-dark'
            name="Account List"
            value={option.value}
            onChange={handlerChangeAccount}
            options={option}
            defaultValue={{value: '0', label: 'Walk-Through'}}
          /> <br />
        </div>
        { accountNum != 0 ? editDisplay() : walkThroughDisplay() }
        <br />
      </div> 
    </>
  );
};

export default CrescentElectricReachList;