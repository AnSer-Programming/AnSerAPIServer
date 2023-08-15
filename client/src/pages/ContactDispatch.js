import {React, useState} from 'react';
import GetContactDispatch from '../components/GetContactDispatch.tsx';
import SetContactDispatch from '../components/SetContactDispatch.tsx';
import Select from 'react-select';

const ContactDispatch = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [option, setOption] = useState([]);
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
    // setGroup(event.value);
  }

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
          isEdit ? <SetContactDispatch 
            optionNum={option}
            setOptions={(optionNum) => setOption(optionNum)}
          /> : <GetContactDispatch 
            optionNum={option}
            setOptions={(optionNum) => setOption(optionNum)}
          />
        } 
        <br />
      </div> 
    </>
  );
};

export default ContactDispatch;