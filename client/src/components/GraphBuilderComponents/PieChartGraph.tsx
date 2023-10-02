import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LinearProgress from '@mui/material/LinearProgress';

const PieGraph = (data:any) => {
  const [gd, setGraphData] = useState<any>(data);
  // console.log(`graph data: ${JSON.stringify(gd)}`);
  
  // use this to determine if `useEffect()` hook needs to run again
  // const graphDataLength = Object.keys(gd.graphData).length;
  
  // useEffect(() => {
  //   const getGraphData = async() => {
  //     try {
  //       setGraphData(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
    
  //   const interval = setInterval(() => {
  //     getGraphData();
  //   }, 60000);
  //   getGraphData();

  //   return () => clearInterval(interval);
  // }, [graphDataLength]);
  
  // if (!graphDataLength) {
  //   return <><br /><LinearProgress color="secondary" /></>;
  // }
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  let totals:any[] = [];
  
  for(let i = 0; i < gd.graphData.length; i++) {
    totals[i] = gd.graphData[i].total;
  }
  
  const label:string[] = Object.keys(gd.graphData);
  const graphData:number[] = Object.values(gd.graphData);

  const pieGraphData = {
    labels: label,
    datasets: [
      {
        label: 'Calls Per Time Zone',
        data: graphData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
    
  return (
    <>
      <div className='text-dark pt-5' style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
        <div className='bg-white' style={{width: '35%'}} >
          <Pie data={pieGraphData} />
        </div>
      </div>
    </>
  );
};
  
export default PieGraph;