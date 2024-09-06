import {React, useState} from 'react';
import DocumentationPage from '../components/HowToComponents/DocumentationPage.tsx';
import Status from '../components/HowToComponents/Status.tsx';
import AnswerPhraseGuide from '../components/HowToComponents/AnswerPhraseGuide.tsx';
import Menu from '../components/Menu.tsx';
import Select from 'react-select';

const HowTo = () => {
  const [content, setContent] = useState("DocumentationPage");

  const handlerChangeAccount = (event) => {
    setContent(event.value);
  }

  const option = [
    {value: 'DocumentationPage', label: 'Documentation'},
    {value: 'AnswerPhraseGuide', label: `Answer Phrase Guide`},
    {value: 'Status', label: `Setting Up Status's`}
  ];
  
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
            defaultValue={{value: 'DocumentationPage', label: 'Documentation'}}
          /> <br />
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