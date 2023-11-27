import {React, useState} from 'react';
import GetDID from '../components/GetData/GetDID.tsx';
import GetClientsDirectories from '../components/GetData/GetClientsDirectories.tsx';
import GetClients from '../components/GetData/GetClients.tsx';
import GetContactsDirectories from '../components/GetData/GetContactsDirectories.tsx';
import GetDirectoryContactsAndInfoCards from '../components/GetData/GetDirectoryContactsAndInfoCards.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const Info = () => {
  const [content, setContent] = useState("GetClients");

  const handlerChangeAccount = (event) => {
    setContent(event.value);
  }

  const option = [
    {value: 'GetClients', label: 'Get Clients'},
    {value: 'GetClientsDirectories', label: 'Get Clients And Directories'},
    {value: 'GetContactsDirectories', label: 'Get Contacts And Directories'},
    {value: 'GetDID', label: 'Get DID'},
    {value: 'GetDirectoryContactsAndInfoCards', label: 'Get Directory Contacts And Info Cards'}
  ];
  
  return (
    <>
      <Menu 
        page="Info" />
      <div style={{width: '100%', padding: '.5%', overflow: 'hidden'}}>
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
            'GetClients': <GetClients />,
            'GetClientsDirectories': <GetClientsDirectories />,
            'GetContactsDirectories': <GetContactsDirectories />,
            'GetDID': <GetDID />,
            'GetDirectoryContactsAndInfoCards': <GetDirectoryContactsAndInfoCards />
          }[content]
        }
      </div>
    </>
  );
};

export default Info;