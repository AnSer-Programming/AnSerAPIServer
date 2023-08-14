import {React, useState} from 'react';
import GetContactDispatch from '../components/GetContactDispatch.tsx';
import SetContactDispatch from '../components/SetContactDispatch.tsx';
import Select from 'react-select';

const ContactDispatch = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [group, setGroup] = useState(0);
  // create method to search for books and set state on form submit

  const editingEnabled = `Exit Editing`;

  const editingDisabled = `Enable Editing`;

  const editingHandler = () => {
    if(isEdit){
      setIsEdit(false);
    }else{
      setIsEdit(true);
    }
  }

  const handlerChangeGroup = (event) => {
    setGroup(event.value);
  }

  const option = [
    {value: 0, label: 'All'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'}
  ]

  return (
    <>
      <div className='text-light bg-dark pt-5' style={{width: '100%', paddingLeft: '5px', paddingRight: '5px'}}>
        <div style={{width: '50%', marginLeft: '5px'}}>
          <Select
            className='text-dark'
            name="Account List"
            value={option.value}
            onChange={handlerChangeGroup}
            options={option}
          /> <br />
        </div>
        <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br />
        {
          isEdit ? <SetContactDispatch groupNum={group}/> : <GetContactDispatch groupNum={group}/>
        } 
        <br />
      </div> 
    </>
  );
};

export default ContactDispatch;