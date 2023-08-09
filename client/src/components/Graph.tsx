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
import { graphData } from '../utils/API';

const OnTimeGraph = () => {
  let fullName:string[] = new Array();
  let numbers:number[] = new Array();
  const [gd, setGraphData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const graphDataLength = Object.keys(gd).length;

  useEffect(() => {
    const getGraphData = async() => {
      try {
        const response = await graphData();

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const onTime = await response.json();
        setGraphData(onTime);
      } catch (err) {
        console.error(err);
      }
    };

    getGraphData();
  }, [graphDataLength]);
  
  if (!graphDataLength) {
    return <h2>LOADING...</h2>;
  }

  for(let i = 0; i < graphDataLength; i++) {
    fullName[i] = `${gd[i].first_name} ${gd[i].last_name}`;
    numbers[i] = gd[i].number;
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
        text: 'Chart.js Line Chart',
      },
    },
  };
  
  const labels = fullName;
  
  const data = {
    labels,
    datasets: [{
      label: 'Programmers',
      data: numbers,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }],
  };
  
  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};

export default OnTimeGraph;