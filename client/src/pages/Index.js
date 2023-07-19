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

const Index = () => {
  // create method to search for books and set state on form submit

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <p>Welcome to the AnSer API Documentation Directory</p>
      </div>
      <Graph />
    </>
  );
};

export default Index;
