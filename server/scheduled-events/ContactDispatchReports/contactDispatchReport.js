const config = require('../../config/connection');
const sql = require('mssql');
const ChartJsImage = require('chartjs-to-image');

function generateCSV(masterSheetCopy) {
  const csvFileData = {
    data: []
  };
  for (let i = 0; i < masterSheetCopy.length; i++) {
    csvFileData.data[i] = {
      'Client ID': masterSheetCopy[i].client_id,
      'Client Number': masterSheetCopy[i].client_number,
      'Client Name': `${masterSheetCopy[i].client_name.replaceAll(/,/g, '').replaceAll(/\./g, '')}`,
      'Billing Code': masterSheetCopy[i].billing_code,
      'Initials': masterSheetCopy[i].initials,
      'Start Date': masterSheetCopy[i].start_date,
      'Sent To Review Date': masterSheetCopy[i].review_sent_date,
      'Reviewer Initials': masterSheetCopy[i].reviewer_initials,
      'Review Completion Date': masterSheetCopy[i].review_complete_date,
      'Activation Date': masterSheetCopy[i].completion_date,
    }
  }

  let count = 1;
  let fileData;
  let keys;
  if (csvFileData.data[0]) {
    keys = Object.keys(csvFileData.data[0]);
  } else {
    keys = [
      'Client ID',
      'Client Number',
      'Client Name',
      'Billing Code',
      'Initials',
      'Start Date',
      'Sent To Review Date',
      'Reviewer Initials',
      'Review Completion Date',
      'Activation Date'
    ];
  }
  const keysLength = Object.keys(keys).length;

  for (let i = 0; i < keysLength; i++) {
    if (keysLength == count) {
      fileData += `${keys[i].trim()}\r\n`;
    } else if (count == 1) {
      fileData = `${keys[i].trim()},`;
    } else {
      fileData += `${keys[i].trim()},`;
    }
    count++;
  }

  for (let x = 0; x < csvFileData.data.length; x++) {
    for (let y = 0; y < keysLength; y++) {
      if (csvFileData.data[x][keys[y]] == null) {
        csvFileData.data[x][keys[y]] = '';
      }
      if (y == keysLength - 1) {
        if (typeof csvFileData.data[x][keys[y]] == "string") {
          fileData += `${csvFileData.data[x][keys[y]].trim()}\r\n`;
        } else {
          fileData += `${csvFileData.data[x][keys[y]]}\r\n`;
        }
      } else {
        if (typeof csvFileData.data[x][keys[y]] == "string") {
          fileData += `${csvFileData.data[x][keys[y]].trim()},`;
        } else {
          fileData += `${csvFileData.data[x][keys[y]]},`;
        }
      }
    }
  }
  return fileData;
}

async function generateChart(data) {
  let values = new Array();
  let count = 0;
  let datesLabel = new Array();
  let dateChecker = false;
  for (const key in data.numbersReport) {
    values[count] = data.numbersReport[key];
    count++;
  }

  count = 0;

  for(let x = 0; x < data.masterSheetCopy.length; x++) {
    dateChecker = false;
    if(data.masterSheetCopy[x].start_date) {
      data.masterSheetCopy[x].start_date = await data.masterSheetCopy[x].start_date.replaceAll(/-/g, '/');
      if(datesLabel.length > 0) {
        for(let y = 0; y < count; y++) {
          if(datesLabel[y] == data.masterSheetCopy[x].start_date) {
            dateChecker = true;
          }
          if(y == count-1 && !dateChecker) {
            datesLabel[count] = await data.masterSheetCopy[x].start_date;
            count++;
          }
        }
      } else {
        datesLabel[count] = await data.masterSheetCopy[x].start_date;
        count++;
      }
    }
    dateChecker = false;
    if(data.masterSheetCopy[x].review_sent_date) {
      data.masterSheetCopy[x].review_sent_date = await data.masterSheetCopy[x].review_sent_date.replaceAll(/-/g, '/');
      if(datesLabel.length > 0) {
        for(let y = 0; y < count; y++) {
          if(datesLabel[y] == data.masterSheetCopy[x].review_sent_date) {
            dateChecker = true;
          }
          if(y == count-1 && !dateChecker) {
            datesLabel[count] = await data.masterSheetCopy[x].review_sent_date;
            count++;
          }
        }
      } else {
        datesLabel[count] = await data.masterSheetCopy[x].review_sent_date;
        count++;
      }
    }
    dateChecker = false;
    if(data.masterSheetCopy[x].completion_date) {
      data.masterSheetCopy[x].completion_date = await data.masterSheetCopy[x].completion_date.replaceAll(/-/g, '/');
      if(datesLabel.length > 0) {
        for(let y = 0; y < count; y++) {
          if(datesLabel[y] == data.masterSheetCopy[x].completion_date) {
            dateChecker = true;
          }
          if(y == count-1 && !dateChecker) {
            datesLabel[count] = await data.masterSheetCopy[x].completion_date;
            count++;
          }
        }
      } else {
        datesLabel[count] = await data.masterSheetCopy[x].completion_date;
        count++;
      }
    }
  }

  let lineChartData = {
    start_date: [],
    review_sent_date: [],
    completion_date: [],
    total_not_started: [],
    total_completed: []
  };

  for(let x = 0; x < datesLabel.length; x++) {
    if(!lineChartData.total_not_started[0]) {
      lineChartData.total_not_started[0] = data.masterSheetCopy.length;
    } else {
      lineChartData.total_not_started[x] = lineChartData.total_not_started[x-1];
    }
    if(x == 0) {
      lineChartData.total_completed[0] = 0;
    } else {
      lineChartData.total_completed[x] = lineChartData.total_completed[x-1];
    }
    lineChartData.start_date[x] = 0;
    lineChartData.review_sent_date[x] = 0;
    lineChartData.completion_date[x] = 0;
    for(let y = 0; y < data.masterSheetCopy.length; y++) {
      if(datesLabel[x] == data.masterSheetCopy[y].start_date) {
        lineChartData.total_not_started[x]--;
        lineChartData.start_date[x]++;
      }
      if(datesLabel[x] == data.masterSheetCopy[y].review_sent_date) {
        lineChartData.review_sent_date[x]++;
      }
      if(datesLabel[x] == data.masterSheetCopy[y].completion_date) {
        lineChartData.completion_date[x]++;
        lineChartData.total_completed[x]++;
      }
    }
  }

  const myChart = new ChartJsImage();
  myChart.setConfig({
    type: 'polarArea',
    data: {
      labels: ['Accounts Not Started', 'Accounts In Process', 'Accounts In Review', 'Total Not Activated', 'Total Activated'],
      datasets: [{
        label: "Contact Dispatch",
        data: values,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ]
      }]
    },
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/polarAreaChart.png');

  myChart.setConfig({
    type: 'pie',
    data: {
      labels: [
        `Accounts Not Started`, 
        `Accounts In Process`, 
        `Accounts In Review`, 
        `Total Not Activated`, 
        `Total Activated`
      ],
      datasets: [{
        label: "Contact Dispatch",
        data: values,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ]
      }]
    },
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/pieChartLabelsOnly.png');

  myChart.setConfig({
    type: 'pie',
    data: {
      labels: [
        `Accounts Not Started: ${values[0]}`, 
        `Accounts In Process: ${values[1]}`, 
        `Accounts In Review: ${values[2]}`, 
        `Total Not Activated: ${values[3]}`, 
        `Total Activated: ${values[4]}`
      ],
      datasets: [{
        label: "Contact Dispatch",
        data: values,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ]
      }]
    },
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/pieChart.png');

  myChart.setConfig({
    type: 'bar',
    data: {
      labels: [
        `Accounts Not Started`, 
        `Accounts In Process`, 
        `Accounts In Review`, 
        `Total Not Activated`, 
        `Total Activated`
      ],
      datasets: [{
        label: "Contact Dispatch",
        data: values,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
      }]
    },
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/barChartLabelsOnly.png');

  myChart.setConfig({
    type: 'bar',
    data: {
      labels: [
        `Accounts Not Started: ${values[0]}`, 
        `Accounts In Process: ${values[1]}`, 
        `Accounts In Review: ${values[2]}`, 
        `Total Not Activated: ${values[3]}`, 
        `Total Activated: ${values[4]}`
      ],
      datasets: [{
        label: "Contact Dispatch",
        data: values,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
      }]
    },
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/barChart.png');

  myChart.setConfig({
    type: 'line',
    data: {
      labels: datesLabel,
      datasets: [{
        label: "Accounts In Process By Date",
        data: lineChartData.start_date,
        fill: false,
        borderColor: [
          'rgb(255, 205, 86)'
        ],
        borderWidth: 3,
        tension: 0.1
      },{
        label: "Accounts In Review By Date",
        data: lineChartData.review_sent_date,
        fill: false,
        borderColor: [
          'rgb(255, 99, 132)'
        ],
        borderWidth: 6,
        tension: 0.1
      },{
        label: "Accounts Completed By Date",
        data: lineChartData.completion_date,
        fill: false,
        borderColor: [
          'rgb(75, 192, 192)'
        ],
        borderWidth: 9,
        tension: 0.1
      },]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
            stacked: true,
             ticks: {
                min: 0,
                max: 10,
                stepSize: 1,
            }
        }]
      }
    }
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/lineChartScriptProgression.png');

  myChart.setConfig({
    type: 'line',
    data: {
      labels: datesLabel,
      datasets: [{
        label: "Accounts Not Started",
        data: lineChartData.total_not_started,
        fill: false,
        borderColor: [
          'rgb(255, 99, 132)'
        ],
        tension: 0.1
      },{
        label: "Accounts Completed",
        data: lineChartData.total_completed,
        fill: false,
        borderColor: [
          'rgb(75, 192, 192)'
        ],
        tension: 0.1
      },]
    }
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/lineChartScriptsCompleted.png');

  myChart.setConfig({
    type: 'line',
    data: {
      labels: datesLabel,
      datasets: [{
        label: `Accounts Not Started ${lineChartData.total_not_started[lineChartData.total_not_started.length-1]}`,
        data: lineChartData.total_not_started,
        fill: false,
        borderColor: [
          'rgb(255, 99, 132)'
        ],
        tension: 0.1
      },{
        label: `Accounts Completed ${lineChartData.total_completed[lineChartData.total_completed.length-1]}`,
        data: lineChartData.total_completed,
        fill: false,
        borderColor: [
          'rgb(75, 192, 192)'
        ],
        tension: 0.1
      },]
    }
  });
  myChart.setHeight(600);
  myChart.setWidth(1000);

  await myChart.toFile('./scheduled-events/Charts/lineChartScriptsCompletedWithNumbers.png');
}

async function main() {
  const date = new Date().toLocaleDateString();
  const fileName = `${date.split('/')[0]}-${date.split('/')[1]}-${date.split('/')[2].slice(-2)}_ContactDispatch_MasterSheetCopy`;

  const queryBasicNumbers = `SELECT
                  (SELECT COUNT(id)
                    FROM [isapi].[dbo].[contactDispatch]
                    WHERE [start_date] IS NULL) AS not_started,
                  (SELECT COUNT(id)
                    FROM [isapi].[dbo].[contactDispatch]
                    WHERE [start_date] IS NOT NULL AND [review_sent_date] IS NULL AND [review_complete_date] IS NULL AND [completion_date] IS NULL) AS in_process,
                  (SELECT COUNT(id)
                    FROM [isapi].[dbo].[contactDispatch]
                    WHERE [review_sent_date] IS NOT NULL AND [review_complete_date] IS NULL AND [completion_date] IS NULL) AS in_review,
                  (SELECT COUNT(id)
                    FROM [isapi].[dbo].[contactDispatch]
                    WHERE [completion_date] IS NULL) AS not_activated,
                  (SELECT COUNT(id)
                    FROM [isapi].[dbo].[contactDispatch]
                    WHERE [completion_date] IS NOT NULL) AS activated`;

  const QueryMasterSheetCopy = `SELECT * 
                    FROM [isapi].[dbo].[contactDispatch]`;

  async function runQuery(query) {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      return ("catch block: " + err);
    }
  }

  sql.on('error', err => {
    // ... error handler
    return ("sql on: " + err);
  })
  const basicNumbersReport = await runQuery(queryBasicNumbers);
  const masterSheetCopy = await runQuery(QueryMasterSheetCopy);

  const fileData = generateCSV(masterSheetCopy);
  generateChart({numbersReport: basicNumbersReport[0], masterSheetCopy: masterSheetCopy});

  return await { fileName: fileName, fileData: fileData, basicReport: basicNumbersReport[0] };
}

module.exports = main;