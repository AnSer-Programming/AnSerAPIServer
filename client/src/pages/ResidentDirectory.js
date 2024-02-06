import {React, useState, useEffect} from 'react';
import GetResidentDirectory from '../components/ResidentDirectoryComponents/GetResidentDirectory.tsx';
import SetResidentDirectory from '../components/ResidentDirectoryComponents/SetResidentDirectory.tsx';
// import ResidentDirectoryWalkThrough from '../components/WalkThrough/VesselList.tsx';
import Select from 'react-select';
import Menu from '../components/Menu.tsx';
import { getResidentDirectoryAPI } from '../utils/API';
let accountNumPlaceHolder = null;

const ResidentDirectory = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [residentDirectoryData, setResidentDirectoryData] = useState({});
  const [accountNum, setAccountNum] = useState(0);
  const editingEnabled = `Exit Editing`;
  const editingDisabled = `Enable Editing`;

  // use this to determine if `useEffect()` hook needs to run again
  const residentDirectoryDataLength = Object.keys(residentDirectoryData).length;
  
  useEffect(() => {
    const getResidentDirectoryData = async() => {
      try {
        accountNumPlaceHolder = accountNum;
        const response = await getResidentDirectoryAPI(accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let residentData = await response.json();
        
        setResidentDirectoryData(residentData);
        setIsEdit(false);
      } catch (err) {
        console.error(err);
      }
    };

    getResidentDirectoryData();
  }, [residentDirectoryDataLength, accountNum]);
  
  // if (!residentDirectoryDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

//   const residentDirectoryDisplay = () => {
//     return(<ResidentDirectoryWalkThrough />);
//   }

  const editDisplay = () => {
    return(
      <>
        {
          isEdit ?
            <p></p> :
            <div>
              <p>*If your updates don't appear right away, please refresh the page.</p> 
              <p>The list is grouped by Contact, then sorted in reverse alphabetical order for each Vessel under that specific Contact.</p>
            </div>
        }
        <div> 
          <button onClick={editingHandler}>{isEdit ? editingEnabled : editingDisabled}</button> <br /><br /> 
        </div>
        {
          isEdit ? 
            <SetResidentDirectory 
              accountData={residentDirectoryData}
              setEdit={(editBoolean) => setIsEdit(editBoolean)} /> : 
            <GetResidentDirectory
              accountData={residentDirectoryData} /> 
        } 
      </>
    )
  }

  const handlerChangeAccount = (event) => {
    setAccountNum(event.value);
  }

  const editingHandler = () => {
    if(isEdit){
      setIsEdit(false);
    }else{
      setIsEdit(true);
    }
  }

  const option = [
    {value: '0', label: 'Walk-Through'},
    {value: '38', label: 'Account 38: Stephen Merki Test Account'},
    {value: '87712', label: 'Account 87712: Bell Tower Assisted Living'}
  ];

  return (
    <>
      <Menu 
        page="Resident Directory" />
      <div className='text-light bg-dark pt-5' style={{width: '100%', paddingLeft: '5px', paddingRight: '5px'}}>
        <div style={{width: '50%', marginLeft: '5px'}}>
          <Select
            className='text-dark'
            name="Account List"
            value={option.value}
            onChange={handlerChangeAccount}
            options={option}
            defaultValue={{value: '0', label: 'Walk-Through'}}
          /> <br />
        </div>
        { accountNum != 0 ? editDisplay() : <p>Walk Through coming soon!</p>/*walkThroughDisplay()*/ }
        <br />
      </div> 
    </>
  );
};

export default ResidentDirectory;