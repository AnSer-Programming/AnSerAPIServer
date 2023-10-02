import react, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LinearProgress from '@mui/material/LinearProgress';

const SingleLine = (data:any) => {
  const [gd, setGraphData] = useState<any>(data);

  // use this to determine if `useEffect()` hook needs to run again
  const graphDataLength = Object.keys(gd.graphData).length;
  
  if (!graphDataLength) {
    return <><br /><LinearProgress color="secondary" /></>;
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Number of Completed Calls by Hour',
      },
    },
    scales: {
      y: {
        max: 1000,
        min: 0
      }
    },
  };

  let hours:any[] = [];

  for(let i = 0; i < graphDataLength; i++) {
    if(gd.graphData[i].hour < 12) {
      if(gd.graphData[i].hour===12) {
        hours[i] = gd.graphData[i].hour + " PM";
      } else {
        hours[i] = gd.graphData[i].hour + " AM";
      }
    } else {
      if(gd.graphData[i].hour-12===0) {
        hours[i] = gd.graphData[i].hour + " AM";
      } else {
        hours[i] = gd.graphData[i].hour-12 + " PM";
      }
    }
  }
  
  const labels = hours;
  
  const linearGraphData = {
    labels,
    datasets: [{
      label: 'Completed Calls',
      data: gd.graphData.map((index:any) => index.total),      
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }],
  };
  
  return (
    <>
      <div className='text-dark pt-5' style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
        <div className='bg-white' style={{width: '50%'}} >
          <Line options={options} data={linearGraphData} />
        </div>
      </div>
    </>
  );
};

export default SingleLine;