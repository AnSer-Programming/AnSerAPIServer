import {React, useState} from 'react';
import GetOCGroup from '../components/OCGroupComponents/GetOCGroup.tsx';
import SetOCGroup from '../components/OCGroupComponents/SetOCGroup.tsx';
import OCGroupListWalkThrough from '../components/WalkThrough/OCGroupList.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';

const OCGroupList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [accountNum, setAccountNum] = useState(0);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  const walkThroughDisplay = () => {
    return(<OCGroupListWalkThrough />);
  }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ?
            <p></p> :
            <div>
              <p>*If your updates don't appear right away, please refresh the page.</p> 
              <p>The list is in alphabetical order by facility.</p>
            </div>
        }
        <div> 
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br /> 
        </div>
        {
          isEdit ? 
          <SetOCGroup 
          accountNum={accountNum}
          setEdit={(editBoolean) => setIsEdit(editBoolean)}/> : 
          <GetOCGroup
          accountNum={accountNum} />
        } 
      </>
    )
  }

  const handlerChangeAccount = (event) => {
    setAccountNum(event.value);
  }

  const editingHandler = () => {
    if(isEdit){
      setIsEdit(false);
    }else{
      setIsEdit(true);
    }
  }

  const option = [
    {value: '0', label: 'Walk-Through'},
    {value: '44233', label: 'Account 44233: Radiology Associates'}
  ];

  return (
    <>
      <Menu 
        page="OC Group List" />
      <div className='text-light bg-dark pt-5' style={{height: '90vh', width: '100%', paddingLeft: '5px', paddingRight: '5px', overflowY: 'scroll'}}>
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

export default OCGroupList;