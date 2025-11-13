import React, { useEffect, useState } from 'react';
import FileUpload from '../components/DirectoryChecker/FileUpload';
import DirectoryListings from '../components/DirectoryChecker/DirectoryListings';
import UploadDataDisplay from '../components/DirectoryChecker/UploadDataDisplay';
import Menu from '../components/Menu.tsx';
import { getClients } from '../utils/GetDataAPI';

const DirectoryChecker = () => {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [clientsData, setClientsData] = useState({});

  useEffect(() => {
    const getAcountNumbers = async () => {
      const response = await getClients();
      let numbers = new Array;

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      let data = await response.json();

      for (let i = 0; i < data.length; i++) {
        numbers[i] = `${data[i].ClientNumber}`;
      }

      setClientsData(data);
      setAccountNumbers(numbers);
    }

    getAcountNumbers();
  }, []);
  
  return (
    <>
      <Menu
        page="Directory Checker" />
      <div className="mainBody">
        <DirectoryListings
          accountNumbers={accountNumbers}
          clientsData={clientsData} /> <br />
        <FileUpload />
      </div>
    </>
  )
}

export default DirectoryChecker;