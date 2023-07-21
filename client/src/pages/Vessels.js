import {React, useState} from 'react';
import GetVessels from '../components/GetVessels.tsx';
import SetVessels from '../components/SetVessels.tsx';
import Select from 'react-select';

const Vessels = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [accountNum, setAccountNum] = useState(0);
  // create method to search for books and set state on form submit

  const editingEnabled = `Exit Editing`;

  const editingDisabled = `Enable Editing`;

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
    {value: '38', label: 'Account 38: Stephen Merki Test Account'},
    {value: '6071', label: 'Account 6071: Gulf Inland Marine'}
  ]

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Select
          className='text-dark'
          name="Account List"
          value={option.value}
          onChange={handlerChangeAccount}
          options={option}
        /> <br />
        <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br />
        {
          isEdit ? 
          <SetVessels 
          accountNum={accountNum}/> : 
          <GetVessels
          accountNum={accountNum} />
        } 
        <br />
      </div> 
    </>
  );
};

export default Vessels;