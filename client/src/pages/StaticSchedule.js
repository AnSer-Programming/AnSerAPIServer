import {React, useState} from 'react';
import GetStaticSchedule from '../components/StaticScheduleComponents/GetStaticSchedule';
import SetStaticSchedule from '../components/StaticScheduleComponents/SetStaticSchedule';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';

const FixedSchedule = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [accountNum, setAccountNum] = useState(0);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  const walkThroughDisplay = () => {
    return(<p>This is where the walk-through will go :)</p>);
  }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ?
            <div>
              <p>You can only add and delete entries at this time.</p>
            </div> :
            <div>
              <p>*If your updates don't appear right away, please refresh the page.<br /> 
              The list is ordered in alphabetical order by Property Owner.</p>
            </div>
        }
        <div> 
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br /> 
        </div>
        {
          isEdit ? 
          <SetStaticSchedule
          accountNum={accountNum}
          setEdit={(editBoolean) => setIsEdit(editBoolean)}/> : 
          <GetStaticSchedule
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
    {value: '38', label: 'Account 38: Stephen Merki Test Account'},
    {value: '52128', label: 'Account 52128: Pulmonary Exchange, LTD'}
  ]

  return (
    <>
      <Menu 
        page="Static Schedule" />
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

export default FixedSchedule;