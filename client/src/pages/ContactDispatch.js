import {React, useState, useCallback} from 'react';
import GetContactDispatch from '../components/GetContactDispatch.tsx';
import SetContactDispatch from '../components/SetContactDispatch.tsx';
import Select from 'react-select';

const ContactDispatch = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [maxPage, setMaxPage] = useState(1);
  const [option, setOption] = useState(0);
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

  const nextPageHandler = () => {
    if(option < maxPage) {
      let pageNum = option + 1;
      setOption(pageNum);
    } else {
      setOption(maxPage);
    }
  }

  const previousPageHandler = () => {
    if(option > 0) {
      let pageNum = option -1;
      setOption(pageNum);
    } else {
      setOption(0);
    }
  }


  return (
    <>
      <div className='text-light bg-dark pt-5' style={{width: '100%', paddingLeft: '5px', paddingRight: '5px'}}>
        <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br />
        <button onClick={previousPageHandler}>Previous</button>
        <span> Page: {option+1} </span>
        <button onClick={nextPageHandler}>Next</button><br /><br />
        {
          isEdit ? <SetContactDispatch 
            pageNum={option}
            setMax={(max) => setMaxPage(max)}
          /> : <GetContactDispatch 
            pageNum={option}
            setMax={(max) => setMaxPage(max)}
          />
        } 
        <br />
        <button onClick={previousPageHandler}>Previous</button>
        <span> Page: {option+1} </span>
        <button onClick={nextPageHandler}>Next</button>
      </div> 
    </>
  );
};

export default ContactDispatch;