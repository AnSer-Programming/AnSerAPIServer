import React, { useState, useEffect } from 'react';
import { getAgentSupervisor } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const GetClients = () => {
  const [agentSupervisorData, setAgentSupervisorData] = useState<any>({});
  const [agentName, setAgent] = useState<String>("");
  const [supervisorName, setSupervisor] = useState<String>("");
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages:number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const agentSupervisorDataLength = Object.keys(agentSupervisorData).length;
  
  useEffect(() => {
    const getClientsData = async() => {
      try {
        const response = await getAgentSupervisor();  

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let data = await response.json();

        setAgentSupervisorData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [agentSupervisorDataLength, agentName, supervisorName]);

  const pageChangeHandler = (direction:String, input:number) => {
    if(direction==="Select"){
      if(input > maxPages) {
        setPageNum(maxPages);
      } else if(input < 0 || !input) {
        setPageNum(0);
      } else if(input) {
        setPageNum(input);
      }
    } else if(direction === 'Next') {
      if(pageNum < maxPages) {
        setPageNum(pageNum+1);
      }
    } else {
      if(pageNum > 0) {
        setPageNum(pageNum-1);
      }
    }
  }

  const maxPageSetter = () => {
    maxPages = (Math.ceil((agentSupervisorDataLength/25)-1));
  }

  const tableBuilder = () => {
    let length:number = 25;
    let start:number = length * pageNum;
    let rows:any = [];
    for(let i = 0; i < length; i++) {
      if(agentSupervisorData[i+start] == undefined) {
        break;
      } else {
        if(agentName) {
          if(agentSupervisorData[i+start].Agent.includes(agentName)) {
            rows.push( 
              <tr key={i} style={{minWidth: '100%'}}>
                <td style={{paddingRight: '25px'}}>Agent Name: {agentSupervisorData[i+start].Agent}</td>
                <td style={{paddingRight: '25px'}}>Supervisor Name: {agentSupervisorData[i+start].Supervisor}</td>
                <td style={{paddingRight: '25px'}}>Office: {agentSupervisorData[i+start].Office}</td>
              </tr>
            )  
          }
        } else if(supervisorName) {
          if(agentSupervisorData[i+start].Supervisor) {
            if(agentSupervisorData[i+start].Supervisor.includes(supervisorName)) {
              rows.push( 
                <tr key={i} style={{minWidth: '100%'}}>
                  <td style={{paddingRight: '25px'}}>Agent Name: {agentSupervisorData[i+start].Agent}</td>
                  <td style={{paddingRight: '25px'}}>Supervisor Name: {agentSupervisorData[i+start].Supervisor}</td>
                <td style={{paddingRight: '25px'}}>Office: {agentSupervisorData[i+start].Office}</td>
                </tr>
              )  
            }
          }
        } else {
          rows.push( 
            <tr key={i} style={{minWidth: '100%'}}>
              <td style={{paddingRight: '25px'}}>Agent Name: {agentSupervisorData[i+start].Agent}</td>
              <td style={{paddingRight: '25px'}}>Supervisor Name: {agentSupervisorData[i+start].Supervisor}</td>
              <td style={{paddingRight: '25px'}}>Office: {agentSupervisorData[i+start].Office}</td>
            </tr>
          )
        }
      }
    }
    return rows;
  }

  return (
    <>
      {maxPageSetter()}
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select", parseInt(event.target.value)-1);
        }} 
        sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0}}
        variant="filled" />
      </Tooltip>
      <TextField label={"Agent Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAgent(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0}}
        variant="filled" />
      <TextField label={"Supervisor Name"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSupervisor(event.target.value);
        }} 
        sx={{ width: 250, background: 'white', marginLeft: '1.5%', zIndex: 0}}
        variant="filled" /> <br /><br />
      {
        agentSupervisorDataLength ? 
          <table>
            <tbody>
              {tableBuilder()}
            </tbody>
          </table> : <h2>LOADING...</h2>
      } <br />
      <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum+1} of ${maxPages+1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
    </>
  );
};

export default GetClients;