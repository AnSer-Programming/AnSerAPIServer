import {React, useState, useEffect} from 'react';
import GetScheduler from '../components/SchedulerComponents/AgentView.tsx';
import SetScheduler from '../components/SetScheduler';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';
import { getSchedulerAPI } from '../utils/API';

const SchedulerAgent = () => {
  const [schedulerData, setSchedulerData] = useState({});
  const [accountNum, setAccountNum] = useState(0);
  // use this to determine if `useEffect()` hook needs to run again
  const schedulerDataLength = Object.keys(schedulerData).length;

  const walkThroughDisplay = () => {
    // return(<VesselListWalkThrough />);
  }

  const handlerChangeAccount = (event) => {
    setAccountNum(event.value);
  }

  const changeAccount = (accountNumber) => {
    return (
      <>
        <GetScheduler
          accountData={accountNumber} />
      </>
    )
  }

  const option = [
    {value: '0', label: 'Walk-Through'},
    {value: '38', label: 'Account 38: Stephen Merki Test Account'},
    {value: '52054', label: 'Account 52054: Dr Michael Byrnes'}
  ];

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
        { accountNum != 0 ? changeAccount(accountNum) : walkThroughDisplay() }
        <br />
      </div> 
    </>
  );
};

export default SchedulerAgent;