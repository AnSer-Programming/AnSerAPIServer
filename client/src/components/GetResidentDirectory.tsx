import React, { useState, useEffect } from 'react';

const GetResidentDirectory = (data:any) => {
  const [residentDirectoryData, setResidentDirectoryData] = useState<any>({});
  useEffect(() => {
    setResidentDirectoryData(data.accountData);
  }, [data.accountData])

  return (
    <>
      <table>
        <tbody>
          {Object.keys(residentDirectoryData).map((index) => (
            <tr key={`row${index}`}>
              <td key={residentDirectoryData[index].resident_full_name} style={{paddingRight: '25px'}}>Resident Name: {residentDirectoryData[index].resident_full_name}</td>
              <td key={residentDirectoryData[index].resident_room_number} style={{paddingRight: '25px'}}>Resident Room Number: {residentDirectoryData[index].resident_room_number}</td>
              <td key={residentDirectoryData[index].resident_phone_number}>Resident Phone Number: {residentDirectoryData[index].resident_phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetResidentDirectory;