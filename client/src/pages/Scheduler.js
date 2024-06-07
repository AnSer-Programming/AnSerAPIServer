import {React, useState, useEffect} from 'react';
import GetScheduler from '../components/GetScheduler.tsx';
import SetScheduler from '../components/SetScheduler';
// import VesselListWalkThrough from '../components/WalkThrough/VesselList.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';
import { getSchedulerAPI } from '../utils/API';

const Scheduler = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [schedulerData, setSchedulerData] = useState({});
  const [accountNum, setAccountNum] = useState(0);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  // use this to determine if `useEffect()` hook needs to run again
  const schedulerDataLength = Object.keys(schedulerData).length;
  
  useEffect(() => {
    const getSchedulerData = async() => {
      try {
        const response = await getSchedulerAPI(accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();
        
        setSchedulerData(data);
        console.log(data);
        setIsEdit(false);
      } catch (err) {
        console.error(err);
      }
    };

    getSchedulerData();
  }, [schedulerDataLength, accountNum]);

  const walkThroughDisplay = () => {
    // return(<VesselListWalkThrough />);
  }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ?
            <p></p> :
            <div>
              <p>*If your updates don't appear right away, please refresh the page.</p> 
              <p>The list is grouped by Contact, then sorted in reverse alphabetical order for each Vessel under that specific Contact.</p>
            </div>
        }
        <div> 
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br /> 
        </div>
        {
          isEdit ? 
            <SetScheduler 
              accountData={schedulerData}
              setEdit={(editBoolean) => setIsEdit(editBoolean)} /> : 
            <GetScheduler
              accountData={schedulerData} /> 
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
    {value: '52054', label: 'Account 52054: Dr Michael Byrnes'}
  ];

  return (
    <>
      <Menu 
        page="Scheduler Tool" />
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

export default Scheduler;