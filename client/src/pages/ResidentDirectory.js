import React, { useState, useEffect } from 'react';
import GetResidentDirectory from '../components/ResidentDirectoryComponents/GetResidentDirectory.tsx';
import SetResidentDirectory from '../components/ResidentDirectoryComponents/SetResidentDirectory.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';
import { getResidentDirectoryAPI } from '../utils/API';

const ResidentDirectory = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [accountNum, setAccountNum] = useState(0);
  const [residentDirectoryData, setResidentDirectoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResidentDirectoryData = async () => {
      if (accountNum === 0) return;

      setIsLoading(true);
      try {
        const response = await getResidentDirectoryAPI(accountNum);
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }

        const residentData = await response.json();
        setResidentDirectoryData(residentData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidentDirectoryData();
  }, [accountNum]);

  const handleEditMode = (index) => {
    setEditIndex(index);
    setIsEdit(true);
  };

  const handleAddResident = () => {
    setResidentDirectoryData([
      ...residentDirectoryData,
      { resident_full_name: '', resident_room_number: '', resident_phone_number: '' },
    ]);
    setIsEdit(true);
  };

  const handleChangeAccount = (selectedOption) => {
    setAccountNum(selectedOption.value);
  };

  const accountOptions = [
    { value: '0', label: 'Walk-Through' },
    { value: '38', label: 'Account 38: Stephen Merki Test Account' },
    { value: '87712', label: 'Account 87712: Bell Tower Assisted Living' },
    { value: '39', label: 'Resident Directory Test - Cristian' },
  ];

  return (
    <>
      <Menu page="Resident Directory" />
      <div style={{ width: '100%', padding: 20, backgroundColor: '#282c34' }}>
        <div style={{ width: '50%', margin: '0 auto', marginBottom: 30 }}>
          <Select
            className="text-dark"
            name="Account List"
            value={accountOptions.find(option => option.value === accountNum)}
            onChange={handleChangeAccount}
            options={accountOptions}
            defaultValue={{ value: '0', label: 'Walk-Through' }}
          />
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', marginTop: 50, color: '#fff' }}>Loading data...</p>
        ) : accountNum !== 0 ? (
          <div style={{ padding: 20, backgroundColor: '#f4f4f4', borderRadius: 8 }}>
            <h2 style={{ marginBottom: 20, color: '#000' }}>Resident Directory</h2>

            <button
              style={{ marginBottom: 30, padding: 10, backgroundColor: '#003366', color: '#fff' }}
              onClick={handleAddResident}
            >
              Add Resident
            </button>

            {isEdit && editIndex !== null ? (
              <SetResidentDirectory
                accountData={residentDirectoryData}
                setEdit={setIsEdit}
              />
            ) : (
              <GetResidentDirectory
                accountData={residentDirectoryData}
                onEdit={handleEditMode}
                textStyle={{ color: '#000' }} // Added prop to pass text color style
              />
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: 50, color: '#fff' }}>
            Please select an account to view residents.
          </p>
        )}
      </div>
    </>
  );
};

export default ResidentDirectory;








