import React, { useState, useEffect } from 'react';
import { getProviders } from '../../utils/GetDataAPI';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Select from 'react-select';

const GetProviders = () => {
  const [columnHeaders, setHeaders] = useState<any[]>([]);
  const [data, setData] = useState<any>({});
  const [providerData, setProviderData] = useState<String>('');
  const [pageNum, setPageNum] = useState<number>(0);
  let maxPages: number = 0;

  // use this to determine if `useEffect()` hook needs to run again
  const dataLength = Object.keys(data).length;

  useEffect(() => {
    const getClientsData = async () => {
      try {
        const response = await getProviders(providerData);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        console.log(response);

        let results = await response.json();

        console.log(results);

        setHeaders(Object.keys(results[0]));

        setData(results);
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [dataLength, providerData]);

  const option = [
    { value: '', label: 'Unlisted' },
    { value: 'agnesian', label: 'Agnesian' },
    { value: 'aspirus_at_home_central_88403', label: 'Aspirus At Home Central Time Zone' },
    { value: 'aspirus_at_home_eastern_88405', label: 'Aspirus At Home Eastern Time Zone' },
    { value: 'aurora', label: 'Aurora' },
    { value: 'beloit', label: 'Beloit' },
    { value: 'corvallis', label: 'Corvallis' },
    { value: 'forefront_dermatology', label: 'ForeFront Dermatology' },
    { value: 'nova_health', label: 'Nova Health' },
    { value: 'peace_health', label: 'Peace Health' },
    { value: 'rome_medical', label: 'Rome Medical' }
  ];

  const maxPageSetter = (pageCount: number) => {
    maxPages = Math.ceil((dataLength / 25) - 1);
  }

  const handlerChangeDatabaseTable = (event:any) => {
    setProviderData(event.value);
  }

  const tableBuilder = () => {
    let length: number = 25;
    let start: number = length * pageNum;
    let elements: any = [];
    let rows: any = [];
    let tableData: any = [];
    let count: number = 0;
    for(let i = 0; i < columnHeaders.length; i++) {
      elements.push(<td style={{paddingRight: '25px'}}>{columnHeaders[i]}</td>);
    }
    tableData.push(
      <thead>
        <tr key='headerRow' style={{ minWidth: '100%', borderBottom: '3px solid white' }}>
          {elements}
        </tr>
      </thead>
    );

    elements = [];
    for (let x = 0; x < length; x++) {
      if (data[x + start] == undefined) {
        break;
      } else {
        for(let y = 0; y < columnHeaders.length; y++) {
          elements.push(<td style={{paddingRight: '25px'}}>{data[x+start][columnHeaders[y]]}</td>)
        }
        rows.push(
          <tr key={x} style={{ minWidth: '100%', borderBottom: '1px solid white' }}>
            {elements}
          </tr>
        )
      }

      elements = [];
    }
    tableData.push(<tbody>{rows}</tbody>)
    maxPageSetter(count);
    return tableData;
  }

  const pageChangeHandler = (direction: String, input: number) => {
    if (direction === "Select") {
      if (input > maxPages) {
        setPageNum(maxPages);
      } else if (input < 0 || !input) {
        setPageNum(0);
      } else if (input) {
        setPageNum(input);
      }
    } else if (direction === 'Next') {
      if (pageNum < maxPages) {
        setPageNum(pageNum + 1);
      }
    } else {
      if (pageNum > 0) {
        setPageNum(pageNum - 1);
      }
    }
  }

  return (
    <>
      {/* <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button> */}
      <Tooltip title="Enter Page Number">
        <TextField label={"Page Number"} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          pageChangeHandler("Select", parseInt(event.target.value) - 1);
        }}
          sx={{ width: 150, background: 'white', marginLeft: '.5%', zIndex: 0 }}
          variant="filled" />
      </Tooltip>
      <div style={{ height: '90vh', width: '100%', padding: '.5%', overflowY: 'scroll' }}>
        <div style={{ width: '50%' }}>
          <Select
            className='text-dark'
            name="Account List"
            onChange={handlerChangeDatabaseTable}
            options={option}
            defaultValue={{ value: '', label: 'Unlisted' }}
          /> <br />
        </div>
        {
          dataLength ?
            <table>
                {tableBuilder()}
            </table> : <h2>LOADING...</h2>
        } <br />
        <button onClick={() => pageChangeHandler('Previous', 0)}>Previous</button> {`${pageNum + 1} of ${maxPages + 1}`} <button onClick={() => pageChangeHandler('Next', 0)}>Next</button>
      </div>
    </>
  );
};

export default GetProviders;