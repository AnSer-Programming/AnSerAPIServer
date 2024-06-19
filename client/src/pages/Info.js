import {React, useState} from 'react';
import GetAgentSupervisor from '../components/GetData/GetAgentSupervisor.tsx';
import GetDID from '../components/GetData/GetDID.tsx';
import GetClientsDirectories from '../components/GetData/GetClientsDirectories.tsx';
import GetClients from '../components/GetData/GetClients.tsx';
import GetContactsDirectories from '../components/GetData/GetContactsDirectories.tsx';
import GetDirectoryContactsAndInfoCards from '../components/GetData/GetDirectoryContactsAndInfoCards.tsx';
import GetInfoPages from '../components/GetData/GetInfoPages.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const Info = () => {
  const [content, setContent] = useState("GetClients");

  const handlerChangeAccount = (event) => {
    setContent(event.value);
  }

  const option = [
    {value: 'GetAgentSupervisor', label: 'Get Agents Supervisors'},
    {value: 'GetClients', label: 'Get Clients'},
    {value: 'GetClientsDirectories', label: 'Get Clients And Directories'},
    {value: 'GetContactsDirectories', label: 'Get Contacts And Directories'},
    {value: 'GetDID', label: 'Get DID'},
    {value: 'GetDirectoryContactsAndInfoCards', label: 'Get Directory Contacts And Info Cards'},
    {value: 'GetInfoPages', label: 'Get Info Pages'}
  ];
  
  return (
    <>
      <Menu 
        page="Info" />
      <div style={{height: '90vh', width: '100%', padding: '.5%', overflowY: 'scroll'}}>
        <div style={{width: '50%'}}>
          <Select
            className='text-dark'
            name="Account List"
            value={option.value}
            onChange={handlerChangeAccount}
            options={option}
            defaultValue={{value: 'GetClients', label: 'Get Clients'}}
          /> <br />
        </div>
        {
          {/* this acts as a case branch where the options in single quotes are what we are checking for, the option in square brackets is the argument being passed in*/
            'GetAgentSupervisor': <GetAgentSupervisor />,
            'GetClients': <GetClients />,
            'GetClientsDirectories': <GetClientsDirectories />,
            'GetContactsDirectories': <GetContactsDirectories />,
            'GetDID': <GetDID />,
            'GetDirectoryContactsAndInfoCards': <GetDirectoryContactsAndInfoCards />,
            'GetInfoPages': <GetInfoPages />
          }[content]
        }
      </div>
    </>
  );
};

export default Info;