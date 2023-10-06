import {React, useState} from 'react';
import GetClientsDirectories from '../components/GetData/GetClientsDirectories.tsx';
import GetClients from '../components/GetData/GetClients.tsx'
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
    {value: '6071', label: 'Account 6071: Gulf Inland Marine'}
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
            'GetClientsDirectories': <GetClientsDirectories />
          }[content]
        }
      </div>
    </>
  );
};

export default Info;