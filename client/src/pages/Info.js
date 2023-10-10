import {React, useState} from 'react';
import GetActiveDID from '../components/GetData/GetActiveDID.tsx';
import GetClientsDirectories from '../components/GetData/GetClientsDirectories.tsx';
import GetClients from '../components/GetData/GetClients.tsx';
import GetContactsDirectories from '../components/GetData/GetContactsDirectories.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const Info = () => {
  const [content, setContent] = useState("GetClients");

  const handlerChangeAccount = (event) => {
    setContent(event.value);
  }

  const option = [
    {value: 'GetClients', label: 'Get Clients'},
    {value: 'GetActiveDID', label: 'Get Active DIDs'},
    {value: 'GetClientsDirectories', label: 'Get Clients And Directories'},
    {value: 'GetContactsDirectories', label: 'Get Contacts And Directories'}
  ];
  
  return (
    <>
      <Menu 
        page="Info" />
      <div style={{padding: '.5%'}}>
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
          {
            'GetClients': <GetClients />,
            'GetClientsDirectories': <GetClientsDirectories />,
            'GetContactsDirectories': <GetContactsDirectories />,
            'GetActiveDID': <GetActiveDID />
          }[content]
        }
      </div>
    </>
  );
};

export default Info;