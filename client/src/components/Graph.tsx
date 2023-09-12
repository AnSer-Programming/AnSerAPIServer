import React, { useState, useEffect } from 'react';
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
import { onTimeData } from '../utils/API';
import LinearProgress from '@mui/material/LinearProgress';

const OnTimeGraph = () => {
  let months:string[] = new Array();
  let numbers:any = {};
  let low:number = 0;
  let average:number = 0;
  const [gd, setGraphData] = useState<any>({});

  // use this to determine if `useEffect()` hook needs to run again
  const graphDataLength = Object.keys(gd).length;

  useEffect(() => {
    const getGraphData = async() => {
      try {
        const response = await onTimeData();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const onTime = await response.json();
        setGraphData(onTime.OnTime);
      } catch (err) {
        console.error(err);
      }
    };

    getGraphData();
  }, [graphDataLength]);
  
  if (!graphDataLength) {
    return <LinearProgress color="secondary" />;
  }

  for(let i = 0; i < graphDataLength; i++) {
    months[i] = gd[i].Month;
    if(i==0) {
      low = gd[i].PercentOn;
    } else if(i>0 && low > gd[i].PercentOn) {
      low = gd[i].PercentOn;
    }
    average += gd[i].PercentOn;
    numbers[months[i]] = gd[i].PercentOn;
  }

  average = average/graphDataLength;

  console.log(average.toFixed(2));

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
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      y: {
        max: 1.00,
        min: low-.05
      }
    },
  };
  
  const labels = months;
  
  const data = {
    labels,
    datasets: [{
      label: 'Persons Name',
      data: labels.map((index:any) => numbers[index]),      
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }],
  };
  
  return (
    <>
      <div className='text-dark bg-light pt-5'>
        <Line options={options} data={data} />
      </div>
    </>
  );
};

export default OnTimeGraph;