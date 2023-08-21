import React from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';
import Graph from '../components/Graph.tsx';
import HomeAccordion from '../components/HomeAccordion.js';
import logo from '../assets/img/AnSerLogo2.png';

const AgentStats = () => {
  // create method to search for books and set state on form submit

  return (
    <>
      <div className='text-light bg-dark pt-5 text-center' style={{paddingLeft: '5px', paddingRight: '5px'}}>
        <img src={logo} alt='Logo' className="mr-3"/> <br /><br /><br />
      </div>
      <Graph />
    </>
  );
};

export default AgentStats;