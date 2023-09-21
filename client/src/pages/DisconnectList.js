import {React, useState} from 'react';
import GetDisconnectList from '../components/GetDisconnectList.tsx';
import SetDisconnectList from '../components/SetDisconnectList.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';

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
            <div>
              <p><span className='text-warning'>*</span>If the fields turn <span className='bg-warning text-dark'>Orange</span> then you need to fill in at least one of the <span className='bg-warning text-dark'>Orange</span> fields in the group.<br />
              <span className='text-danger'>*</span>If the fields turn <span className='bg-danger text-white'>Red</span> then you need to fill in that field.</p>
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
    {value: '6509', label: 'Account 6509: Plymouth Utilities'}
  ]

  return (
    <>
      <Menu 
        page="Disconnect List" />
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