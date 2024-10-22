import {React, useState, useEffect} from 'react';
import DocumentationPage from '../components/HowToComponents/DocumentationPage.tsx';
import Status from '../components/HowToComponents/Status.tsx';
import AnswerPhraseGuide from '../components/HowToComponents/AnswerPhraseGuide.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const HowTo = () => {
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

  const option = [
    {value: 'DocumentationPage', label: 'Documentation'},
    {value: 'AnswerPhraseGuide', label: `Answer Phrase Guide`},
    {value: 'Status', label: `Setting Up Status's`}
  ];

  const handlerChangeAccount = (event) => {
    setContent(event.value);
    setDefaultPage(event);
    window.history.pushState(null, "New Page Title", `/HowTo/${event.value}`);
  }
  
  return (
    <>
      <Menu 
        page="How To" />
      <div style={{height: '90vh', width: '100%', padding: '.5%', overflowY: 'scroll'}}>
        <div style={{width: '50%'}}>
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
            'AnswerPhraseGuide': <AnswerPhraseGuide />,
            'Status': <Status />
          }[content]
        }
      </div>
    </>
  );
};

export default HowTo;