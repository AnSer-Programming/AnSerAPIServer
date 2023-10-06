import React, { useState, useEffect } from 'react';
import { getClients } from '../../utils/GetDataAPI';

const GetClients = () => {
  const [clientsData, setClientsData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  
  useEffect(() => {
    const getClientsData = async() => {
      try {
        const response = await getClients();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        setClientsData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength]);
  
  if (!clientsDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <table>
        <tbody>
          {Object.keys(clientsData).map((index) => (
            <tr key={`row${index}`}>
              <td style={{paddingRight: '25px'}}>Client Number: {clientsData[index].ClientNumber}</td>
              <td style={{paddingRight: '25px'}}>Client: {clientsData[index].ClientName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetClients;