import { React, useState, useEffect } from 'react';
import DocumentationPage from '../components/GetData/DocumentationPage.tsx';
import GetAgentSupervisor from '../components/GetData/GetAgentSupervisor.tsx';
import GetClientsDirectories from '../components/GetData/GetClientsDirectories.tsx';
import GetClients from '../components/GetData/GetClients.tsx';
import GetClientContactsAndRoles from '../components/GetData/GetClientContactsAndRoles.tsx';
import GetContactsDirectories from '../components/GetData/GetContactsDirectories.tsx';
import GetDID from '../components/GetData/GetDID.tsx';
import GetDirectoryContactsAndInfoCards from '../components/GetData/GetDirectoryContactsAndInfoCards.tsx';
import GetInfoPages from '../components/GetData/GetInfoPages.tsx';
import GetProviders from '../components/GetData/GetProviders.tsx';
import GetMailGunFailedEvents from '../components/GetData/GetMailGunFailedEvents.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const Info = () => {
  const [content, setContent] = useState("DocumentationPage");
  const [defaultPage, setDefaultPage] = useState({ value: 'DocumentationPage', label: 'Documentation' });

  const url = window.location.href.toString();
  const destination = url.split('/')[4];

  useEffect(() => {
    if (destination) {
      for (let i = 0; i < option.length; i++) {
        if (option[i].value == destination) {
          setContent(destination);
          setDefaultPage(option[i]);
          break;
        } else {
          setContent("DocumentationPage");
          setDefaultPage({ value: 'DocumentationPage', label: 'Documentation' });
        }
      }
    } else {
      setContent("DocumentationPage");
      setDefaultPage({ value: 'DocumentationPage', label: 'Documentation' });
    }
  }, [url, destination]);

  const handlerChangeAccount = async(event) => {
    setContent(event.value);
    setDefaultPage(event);
    window.history.pushState(null, "New Page Title", `/Info/${event.value}`);
  }

  const option = [
    { value: 'DocumentationPage', label: 'Documentation' },
    { value: 'GetAgentSupervisor', label: 'Get Agents Supervisors' },
    { value: 'GetClients', label: 'Get Clients' },
    { value: 'GetClientContactsAndRoles', label: `Get Client Contacts And Roles` },
    { value: 'GetClientsDirectories', label: 'Get Clients And Directories' },
    { value: 'GetContactsDirectories', label: 'Get Contacts And Directories' },
    { value: 'GetProviders', label: 'Get Databased Providers' },
    { value: 'GetDID', label: 'Get DID' },
    { value: 'GetDirectoryContactsAndInfoCards', label: 'Get Directory Contacts And Info Cards' },
    { value: 'GetInfoPages', label: 'Get Info Pages' },
    { value: 'GetMailGunFailedEvents', label: 'Mail Gun Failed Events' }
  ];

  return (
    <>
      <Menu
        page="Info" />
      <div style={{ height: '90vh', width: '100%', padding: '.5%', overflowY: 'scroll' }}>
        <div style={{ width: '50%' }}>
          <Select
            className='text-dark'
            name="Account List"
            value={option.value}
            onChange={handlerChangeAccount}
            options={option}
            placeholder={defaultPage.label} /> <br />
        </div>
        {
          {/* this acts as a case branch where the options in single quotes are what we are checking for, the option in square brackets is the argument being passed in*/
            'DocumentationPage': <DocumentationPage />,
            'GetAgentSupervisor': <GetAgentSupervisor />,
            'GetClients': <GetClients />,
            'GetClientContactsAndRoles': <GetClientContactsAndRoles />,
            'GetClientsDirectories': <GetClientsDirectories />,
            'GetContactsDirectories': <GetContactsDirectories />,
            'GetDID': <GetDID />,
            'GetDirectoryContactsAndInfoCards': <GetDirectoryContactsAndInfoCards />,
            'GetInfoPages': <GetInfoPages />,
            'GetProviders': <GetProviders />,
            'GetMailGunFailedEvents': <GetMailGunFailedEvents />
          }[content]
        }
      </div>
    </>
  );
};

export default Info;