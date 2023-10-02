import React from 'react';
import HomeAccordion from '../components/HomeAccordion.js';
import logo from '../assets/img/AnSerLogo2.png';
import Menu from '../components/Menu.tsx';

const Index = () => {
  return (
    <>
      <Menu 
        page="Home" />
      <div className='text-light bg-dark pt-5 text-center' style={{paddingLeft: '5px', paddingRight: '5px'}}>
        <img src={logo} alt='Logo' className="mr-3"/> <br /><br /><br />
      </div>
      <HomeAccordion />
    </>
  );
};

export default Index;