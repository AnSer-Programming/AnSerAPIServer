import {React, useState} from 'react';
import GetDisconnectList from '../components/GetDisconnectList.tsx';
import SetDisconnectList from '../components/SetDisconnectList.tsx';
import Select from 'react-select';

const DisconnectList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [accountNum, setAccountNum] = useState(0);
  // create method to search for books and set state on form submit

  const editingEnabled = `Exit Editing`;

  const editingDisabled = `Enable Editing`;

  const walkThroughDisplay = () => {
    return(<p>This is where the walk-through will go.</p>);
  }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ?
            <p></p> :
            <div>
              <p>*If your updates don't appear right away, please refresh the page.</p> 
              <p>The list is ordered in alphabetical order by Property Owner.</p>
            </div>
        }
        <div> 
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br /> 
        </div>
        {
          isEdit ? 
          <SetDisconnectList
          accountNum={accountNum}
          setEdit={(editBoolean) => setIsEdit(editBoolean)}/> : 
          <GetDisconnectList
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
    {value: '6509', label: 'Account 6509: Plymoth Utilities'}
  ]

  return (
    <>
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

export default DisconnectList;