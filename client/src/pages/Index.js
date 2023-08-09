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

const Index = () => {
  // create method to search for books and set state on form submit

  return (
    <>
      <div className='text-light bg-dark pt-5 text-center'>
        <img src={logo} alt='Logo' className="mr-3"/> <br /><br />
        <p>Welcome to the AnSer API Documentation Directory</p>
      </div>
      <HomeAccordion />
    </>
  );
};

export default Index;