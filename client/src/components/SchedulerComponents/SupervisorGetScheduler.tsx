import React, { useState, useEffect } from 'react';
import { getSchedulerAPI } from '../../utils/API';

const GetScheduler = (data:any) => {
  const [schedulerData, setSchedulerData] = useState<any>({});
  const [headerData, setHeaderData] = useState<any>([]);
  const [filterDateData, setDateFilter] = useState<string>("None");
  const [filterAvailabilityData, setAvailabilityFilter] = useState<string>("None");
  
  const schedulerDataLength = Object.keys(schedulerData).length;
  useEffect(() => {
    const getSchedulerData = async() => {
      try {
        const response = await getSchedulerAPI(data.accountNum);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        let responseData = await response.json();
        
        setSchedulerData(responseData);
        setHeaderData(Object.keys(responseData));
      } catch (err) {
        console.error(err);
      }
    };

    getSchedulerData();
  }, [schedulerDataLength, filterDateData, data.accountNum])
  
  if (!schedulerDataLength) {
    return <h2>LOADING...</h2>;
  }

  const tableDataStyle = {
    border: 'solid 2px white',
    width: '25%',
  }

  const tableDataStyleAvailable = {
    background: '#B9EED8',
    border: 'solid 2px white',
    color: 'Black',
    width: '25%',
  }

  const tableDataStyleUnavailable = {
    background: '#FFC0CB',
    border: 'solid 2px white',
    color: 'Black',
    width: '25%',
  }

  const buttonStyles = {
    marginRight: '.25%',
    minWidth: '3%',
    padding: '.25%',
    paddingLeft: '10px',
    paddingRight: '10px'
  }

  const filterBuilder = () => {
    let dataSetter:any = [];
    for(let i = 0; i < headerData.length; i++) {
      dataSetter.push(<button style={buttonStyles} onClick={()=>filterHandler(headerData[i])}>{headerData[i]}</button>);
    }
    dataSetter.push(<><button style={buttonStyles} onClick={()=>filterHandler("None")}>All</button><br /><br /></>);
    dataSetter.push(<><button style={buttonStyles} onClick={()=>filterHandler("Available")}>Available</button><button style={buttonStyles} onClick={()=>filterHandler("Unavailable")}>Unavailable</button><br /><br /></>);
    return dataSetter;
  }

  const filterHandler = (filter:string) => {
    if(filter === "Available" || filter === "Unavailable") {
      setDateFilter("None");
      setAvailabilityFilter(filter);
    } else {
      setAvailabilityFilter("None");
      setDateFilter(filter);
    }
  }

  const tableBuilder = () => {
    let rows:any = [];
    if(filterAvailabilityData !== "None") {
      for(let x = 0; x < headerData.length; x++) {
        if(typeof(schedulerData[headerData[x]]) != "undefined") {
          for(let y=0; y < schedulerData[headerData[x]].length; y++) {
            if(schedulerData[headerData[x]][y].Availability===filterAvailabilityData) {
              rows.push(
                <tr>
                  <td style={tableDataStyle}>{headerData[x]}</td>
                  <td style={tableDataStyle}>{schedulerData[headerData[x]][y].Time.toString()}</td>
                  <td style={filterAvailabilityData == "Available" ? tableDataStyleAvailable : tableDataStyleUnavailable}>{schedulerData[headerData[x]][y].Availability.toString()}</td>
                </tr>
              );
            }
          }
        }
      }
    } else {
      if(filterDateData !== "None") {
        if(typeof(schedulerData[filterDateData]) != "undefined") {
          for(let y=0; y < schedulerData[filterDateData].length; y++) {
            if(schedulerData[filterDateData][y].Availability==="Available") {
              rows.push(
                <tr>
                  <td style={tableDataStyle}>{filterDateData}</td>
                  <td style={tableDataStyle}>{schedulerData[filterDateData][y].Time.toString()}</td>
                  <td style={tableDataStyleAvailable}>{schedulerData[filterDateData][y].Availability.toString()}</td>
                </tr>
              );
            } else {
              rows.push(
                <tr>
                  <td style={tableDataStyle}>{filterDateData}</td>
                  <td style={tableDataStyle}>{schedulerData[filterDateData][y].Time.toString()}</td>
                  <td style={tableDataStyleUnavailable}>{schedulerData[filterDateData][y].Availability.toString()}</td>
                </tr>
              );
            }
          }
        }
      } else {
        for(let x = 0; x < headerData.length; x++) {
          if(typeof(schedulerData[headerData[x]]) != "undefined") {
            for(let y=0; y < schedulerData[headerData[x]].length; y++) {
              if(schedulerData[headerData[x]][y].Availability==="Available") {
                rows.push(
                  <tr>
                    <td style={tableDataStyle}>{headerData[x]}</td>
                    <td style={tableDataStyle}>{schedulerData[headerData[x]][y].Time.toString()}</td>
                    <td style={tableDataStyleAvailable}>{schedulerData[headerData[x]][y].Availability.toString()}</td>
                  </tr>
                );
              } else {
                rows.push(
                  <tr>
                    <td style={tableDataStyle}>{headerData[x]}</td>
                    <td style={tableDataStyle}>{schedulerData[headerData[x]][y].Time.toString()}</td>
                    <td style={tableDataStyleUnavailable}>{schedulerData[headerData[x]][y].Availability.toString()}</td>
                  </tr>
                );
              }
            }
          }
        }
      }
    }
    
    return <><table style={{width: '30%'}}><tbody>{rows}</tbody></table></>;
  }

  return (
    <>
      {filterBuilder()}
      {tableBuilder()}
    </>
  );
};

export default GetScheduler;