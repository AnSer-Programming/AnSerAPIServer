import React, { useState, useEffect } from 'react';
import { getActiveAgents } from '../../utils/TrackerDataAPI';
import LinearProgress from '@mui/material/LinearProgress';
// import dayjs from 'dayjs';

const GetActiveAgents = () => {
  const [activeAgentsData, setActiveAgentsData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const activeAgentsDataLength = Object.keys(activeAgentsData).length;
  
  useEffect(() => {
    const getActiveAgentsData = async() => {
      try {
        const response = await getActiveAgents();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }
        const activeAgents = await response.json();

        setActiveAgentsData(activeAgents);
      } catch (err) {
        console.error(err);
      }
    };
    
    const interval = setInterval(() => {
      getActiveAgentsData();
    }, 60000);
    getActiveAgentsData();

    return () => clearInterval(interval);
  }, [activeAgentsDataLength]);
  
  if (!activeAgentsDataLength) {
    return <><br /><LinearProgress color="secondary" /></>;
  }

  let signInOutObj:any[] = [{
    agtId: null,
    signedIn: null,
    stamp: null
  }]

  async function signedInOutHourly() {
    for(let i = 0; i < activeAgentsDataLength; i++) {
      console.log(activeAgentsData[i].stamp);
      let found:boolean = false;
      for(let x = 0; x < signInOutObj.length; x++) {
        if(signInOutObj[0].agtId == null) {
          signInOutObj[0].agtId = activeAgentsData[i].agtId;
          // signInOutObj[0].stamp = dayjs(activeAgentsData[i].stamp).get('hour');
          if(activeAgentsData[i].type === 1) {
            signInOutObj[x].signedIn = true;
          } else {
            signInOutObj[x].signedIn = false;
          }
          found = true;
        } else if(signInOutObj[x].agtId === activeAgentsData[i].agtId && signInOutObj[x].stamp === activeAgentsData[i].stamp) {
          if(activeAgentsData[i].type === 1) {
            signInOutObj[x].signedIn = true;
          } else {
            signInOutObj[x].signedIn = false;
          }
          found = true;
        } 
      }
      if(!found) {
        signInOutObj[signInOutObj.length] = {agtId: activeAgentsData[i].agtId,signedIn: null,stamp: null};
        // signInOutObj[signInOutObj.length-1].stamp = dayjs(activeAgentsData[i].stamp).get('hour');
        if(activeAgentsData[i].type === 1) {
          signInOutObj[signInOutObj.length-1].signedIn = true;
        } else {
          signInOutObj[signInOutObj.length-1].signedIn = false;
        }
      }
    }
  }

  async function signedInOutCurrentlyIn() {
    for(let i = 0; i < activeAgentsDataLength; i++) {
      let found:boolean = false;
      for(let x = 0; x < signInOutObj.length; x++) {
        if(signInOutObj[0].agtId == null) {
          signInOutObj[0].agtId = activeAgentsData[i].agtId;
          if(activeAgentsData[i].type === 1) {
            signInOutObj[x].signedIn = true;
          } else {
            signInOutObj[x].signedIn = false;
          }
          found = true;
        } else if(signInOutObj[x].agtId === activeAgentsData[i].agtId) {
          if(activeAgentsData[i].type === 1) {
            signInOutObj[x].signedIn = true;
          } else {
            signInOutObj[x].signedIn = false;
          }
          found = true;
        } 
      }
      if(!found) {
        signInOutObj[signInOutObj.length] = {agtId: activeAgentsData[i].agtId,signedIn: null,stamp: null};
        if(activeAgentsData[i].type === 1) {
          signInOutObj[signInOutObj.length-1].signedIn = true;
        } else {
          signInOutObj[signInOutObj.length-1].signedIn = false;
        }
      }
    }
  }

  function currentlySignedIn() {
    let total:number = 0;
    for(let i = 0; i < signInOutObj.length; i++) {
      if(signInOutObj[i].signedIn) {
        total++;
      }
    }
    // let otherTotal:number = 0;
    // let inCounter:number[] = [0];
    // let outCounter:number[] = [0];
    // for(let i = 0; i < signInOutObj.length; i++) {
    //   if(signInOutObj[i].signedIn) {
    //     if(inCounter[signInOutObj[i].stamp]) {
    //       inCounter[signInOutObj[i].stamp]++;
    //     } else {
    //       inCounter[signInOutObj[i].stamp] = 1;
    //     }
    //     otherTotal++;
    //   } else {
    //     if(outCounter[signInOutObj[i].stamp]) {
    //       outCounter[signInOutObj[i].stamp]++;
    //     } else {
    //       outCounter[signInOutObj[i].stamp] = 1;
    //     }
    //     otherTotal--;
    //   }
    // }
    // for(let i = 0; i < inCounter.length; i++) {
    //   total += inCounter[i];
    // }
    // for(let i = 0; i < outCounter.length; i ++) {
    //   total -= outCounter[i];
    // }
    // return `Total: ${total} Other Total: ${otherTotal} Currently Signed In: ${inCounter} Signed Out: ${outCounter}`.toString();
    return `Total Agents Active: ${total}`.toString();
  }
  
  signedInOutCurrentlyIn();

  return (
    <>
      {/* <table>
        <tbody>
          {Object.keys(signInOutObj).map((index:any) => (
            <tr key={`row${index}`}>
              <td key={`${signInOutObj[index].agtId}`} style={{paddingRight: '25px'}}>Agent ID: {signInOutObj[index].agtId}</td>
              <td key={`${signInOutObj[index].Stamp}`} style={{paddingRight: '25px'}}>Time Stamp: {signInOutObj[index].stamp}</td>
              <td key={`${signInOutObj[index].signedIn}`} style={{paddingRight: '25px'}}>Status: {signInOutObj[index].signedIn ? "Signed In" : "Signed Out"}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <div>
        <p>{currentlySignedIn()}</p>
      </div>
    </>
  );
};

export default GetActiveAgents;