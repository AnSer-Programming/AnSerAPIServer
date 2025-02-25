import {React, useState, useCallback} from 'react';
import GetContactDispatch from '../components/GetContactDispatch.tsx';
import SetContactDispatch from '../components/SetContactDispatch.tsx';

const ContactDispatch = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [maxPage, setMaxPage] = useState(1);
  const [option, setOption] = useState(0);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  // const url = window.location.href.toString();
  // const destination = url.split('/')[4];

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
      <div className='text-light bg-dark pt-2' style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', height: '100vh', margin: '0px' }}>
        <button onClick={previousPageHandler}>Previous</button>
        <span> Page: {option+1} </span>
        <button onClick={nextPageHandler}>Next</button>
        <button onClick={editingHandler} style={{position: 'absolute', right: '5px'}} className='mr-4'>{isEdit ? editingEnabled : editingDisabled}</button><br /><br />
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