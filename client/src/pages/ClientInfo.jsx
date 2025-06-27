import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ClientInfoComponent() {
  const [selectedForm, setSelectedForm] = useState('startNewClient');
  const [accountData, setAccountData] = useState(null);
  const history = useHistory();

  // Example function to simulate account number fetch
  const fetchClientInfo = async (accountNum) => {
    try {
      const res = await fetch(`/api/ClientInfo/${accountNum}`);
      if (!res.ok) throw new Error('Not Found');
      const data = await res.json();
      setAccountData(data);
    } catch (error) {
      console.warn('No client found, redirecting...');
      setSelectedForm('clientSetUp');
    }
  };

  useEffect(() => {
    const exampleAccount = '123456'; // Replace with dynamic value if needed
    fetchClientInfo(exampleAccount);
  }, []);

  const renderForm = () => {
    let src;
    switch (selectedForm) {
      case 'answerCalls':
        src = '/ClientInfo/answerCalls.html';
        break;
      case 'clientSetUp':
        src = '/ClientInfo/clientSetUp.html';
        break;
      case 'officeReach':
        src = '/ClientInfo/officeReach.html';
        break;
      case 'startNewClient':
        src = '/ClientInfo/startNewClient.html';
        break;
      case 'test':
        src = '/ClientInfo/test.html';
        break;
      default:
        return <h3>Form not found</h3>;
    }

    return (
      <iframe
        src={src}
        title={selectedForm}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
    );
  };

  return (
    <div className="container mt-3">
      <h1>Client Information Management</h1>
      <div className="btn-group mb-3" role="group">
        <button className="btn btn-primary" onClick={() => setSelectedForm('startNewClient')}>
          Start New Client
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('clientSetUp')}>
          Company Information
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('officeReach')}>
          Office Reach Info
        </button>
        <button className="btn btn-primary" onClick={() => setSelectedForm('answerCalls')}>
          How to Answer Calls
        </button>
        <button className="btn btn-secondary" onClick={() => setSelectedForm('test')}>
          Test Form
        </button>
        <button className="btn btn-warning" onClick={() => setSelectedForm('clientSetUp')}>
          🚧 Manually Go to Client Setup
        </button>
      </div>
      {renderForm()}
    </div>
  );
}

export default ClientInfoComponent;
