import React, { useState, useEffect } from 'react';
import { getInfoPages } from '../../utils/GetDataAPI';
import { toPDF, toMSWord } from '../Utility/DownloadHelper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const GetInfoPages = (data: any) => {
  const [infoPages, setData] = useState<any>({});
  const [maxPage, setMaxPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [accountNum, setAccountNum] = useState<number>(0);
  const [accountName, setAccountName] = useState<string>("");
  const [clientsData, setClientsData] = useState<any>({});
  let regex: RegExp;
  let otherRegex: RegExp;
  let RegexWithDash: RegExp;
  let isDone: boolean = false;

  // use this to determine if `useEffect()` hook needs to run again
  const clientsDataLength = Object.keys(clientsData).length;
  const infoPagesLength = Object.keys(infoPages).length;

  useEffect(() => {
    const getClientsData = async () => {
      try {
        setCurrentPage(0);
        if (accountNum === 0) {
          setClientsData(data.clientsData);
        } else {
          console.log(accountNum);
          const response = await getInfoPages(accountNum);

          if (!response.ok) {
            throw new Error('something went wrong!');
          }

          let data = await response.json();

          for (let i = 0; i < clientsDataLength; i++) {
            if (clientsData[i].ClientNumber == accountNum) {
              setAccountName(clientsData[i].ClientName);
            }
          }

          for (let x = 0; x < data[1].length; x++) {
            regex = new RegExp(`(\[CFld\.([A-Za-z0-9]+(_[A-Za-z0-9]+)+)\.${data[1][x].cltfieldID}\]`);
            otherRegex = new RegExp(`\[CFld\.[A-Za-z0-9]+_-_[A-Za-z0-9]+_[0-9]+\.${data[1][x].cltfieldID}\]`);
            RegexWithDash = new RegExp(`\[CFld\.[A-Za-z0-9]+_-_[A-Za-z0-9]+-[A-Za-z0-9]+_[0-9]+\.${data[1][x].cltfieldID}\]`);
            for (let y = 0; y < data[0].length; y++) {
              isDone = false;
              while (!isDone) {
                if (data[0][y].Info.match(RegexWithDash)) {
                  data[0][y].Info = data[0][y].Info.replace(RegexWithDash, data[1][x].Field);
                }
                else if (data[0][y].Info.match(otherRegex)) {
                  data[0][y].Info = data[0][y].Info.replace(otherRegex, data[1][x].Field);
                }
                else if (data[0][y].Info.match(regex)) {
                  data[0][y].Info = data[0][y].Info.replace(regex, data[1][x].Field);
                } else {
                  isDone = true;
                }
              }
            }
          }

          setData(data[0]);
          setMaxPage((data[0].length - 1));
        }
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength, accountNum]);

  if (!clientsDataLength) {
    <h2>LOADING...</h2>
  }

  function findIndex(index: number, input: any): number[] {
    const regexStartHead: RegExp = /<(head|HEAD)>/;
    const regexEndHead: RegExp = /<\/(head|HEAD)>/;
    const regexHTMLStart: RegExp = /<(html|HTML)>/;
    const regexHTMLEnd: RegExp = /<\/(html|HTML)>/;
    const regexBodyStart: RegExp = /<(BODY|body)>/;
    const regexBodyEnd: RegExp = /<\/(BODY|body)>/;
    let indexArray: number[] = new Array();
    switch (index) {
      case 0:
        indexArray[0] = -1;
        indexArray[1] = -1;
        indexArray[2] = -1;
        indexArray[3] = input.search(regexHTMLEnd);
        indexArray[4] = -1;
        indexArray[5] = input.search(regexBodyEnd);
        break;
      case infoPages.length - 1:
        indexArray[0] = input.search(regexStartHead);
        indexArray[1] = input.search(regexEndHead);
        indexArray[2] = input.search(regexHTMLStart);
        indexArray[3] = -1;
        indexArray[4] = input.search(regexBodyStart);
        indexArray[5] = -1;
        break;
      default:
        indexArray[0] = input.search(regexStartHead);
        indexArray[1] = input.search(regexEndHead);
        indexArray[2] = input.search(regexHTMLStart);
        indexArray[3] = input.search(regexHTMLEnd);
        indexArray[4] = input.search(regexBodyStart);
        indexArray[5] = input.search(regexBodyEnd);
    }

    return indexArray;
  }

  function purgeImages(data: string): string {
    const regexImg: RegExp = /<(IMG|img) alt=CFld\.([A-Za-z0-9]+(_[A-Za-z0-9]+)+)\.[0-9]+ src="C:\\([A-Za-z0-9]+(\\[A-Za-z0-9]+)+)\.GIF" align=left>/;
    const regexImgWithFile: RegExp = /<(IMG|img) alt=([0-9]+(-[0-9]+)+) src="file:\/\/C:\\([A-Za-z0-9]+(\\[A-Za-z0-9]+)+)\.GIF" align=left>/;
    const regexImgWithAlt: RegExp = /<(IMG|img) alt=([0-9]+(-[0-9]+)+) src="C:\\([A-Za-z0-9]+(\\[A-Za-z0-9]+)+)\.GIF" align=left>/;
    const regexImgWithAltCue: RegExp = /<(IMG|img) alt="[0-9]+<([0-9]+(-[0-9]+)+)" src="C:\\([A-Za-z0-9]+(\\[A-Za-z0-9]+)+)\.GIF" align=left(| \/)>/;
    const regexImgWithEmptyAlt: RegExp = /<(IMG|img) alt="" src="C:\\([A-Za-z0-9]+(\\[A-Za-z0-9]+)+)\.GIF" align=left>/;
    let isDone: boolean = false;
    while (!isDone) {
      if (data.search(regexImg) !== -1) {
        data = data.replace(regexImg, "");
      } else if (data.search(regexImgWithAlt) !== -1) {
        data = data.replace(regexImgWithAlt, "");
      } else if (data.search(regexImgWithAltCue) !== -1) {
        data = data.replace(regexImgWithAltCue, "");
      } else if (data.search(regexImgWithEmptyAlt) !== -1) {
        data = data.replace(regexImgWithEmptyAlt, "");
      } else if (data.search(regexImgWithFile) !== -1) {
        data = data.replace(regexImgWithFile, "");
      } else {
        isDone = true;
      }
    }
    return data;
  }

  async function downloadHandler(docType: any) {
    console.log(docType);
    let fileData: any;
    let fileName: string = `${accountNum} ${accountName} Info Pages`;
    let placeHolder: string;
    if (docType == "wordDoc") {
      fileData = " ";
      for (let i = 0; i < infoPages.length; i++) {
        let indexArray: number[] = await findIndex(i, infoPages[i].Info);
        placeHolder = await infoPages[i].Info;
        placeHolder.trim();
        placeHolder.replace(/\r\n/g, "");
        if (indexArray[3] !== -1) {
          placeHolder = await placeHolder.replace(placeHolder.slice(indexArray[3], indexArray[3] + 7), "");
        }
        if (indexArray[5] !== -1) {
          placeHolder = await placeHolder.replace(placeHolder.slice(indexArray[5], indexArray[5] + 7), "");
        }
        if (indexArray[4] !== -1) {
          placeHolder = await placeHolder.replace(placeHolder.slice(indexArray[4], indexArray[4] + 6), `<br style="page-break-before: always">`);
        }
        if (indexArray[0] !== -1 && indexArray[1] !== -1) {
          placeHolder = await placeHolder.replace(placeHolder.slice(indexArray[0], indexArray[1] + 7), "");
        }
        if (indexArray[2] !== -1) {
          placeHolder = await placeHolder.replace(placeHolder.slice(indexArray[2], indexArray[2] + 6), "");
        }
        placeHolder = purgeImages(placeHolder);
        if (i === 0) {
          fileData = await placeHolder;
        } else {
          fileData += await placeHolder;
        }
      }
    } else {
      fileData = new Array();
      for (let i = 0; i < infoPages.length; i++) {
        fileData[i] = await infoPages[i].Info;
      }
    }
    // fileData += "<header><img src='../../assets/img/AnserLogo2.png' /></header>";
    console.log(`${fileName} \n${fileData}`);
    if (docType == "wordDoc") {
      await toMSWord(fileData, fileName);
    } else {
      await toPDF(fileData, fileName);
    }
  }

  const pageHandler = (direction: string) => {
    if (direction === "previous") {
      if (currentPage === 0) {
        setCurrentPage(maxPage);
      } else {
        setCurrentPage(currentPage - 1);
      }
    } else if (direction === "next") {
      if (currentPage === maxPage) {
        setCurrentPage(0);
      } else {
        setCurrentPage(currentPage + 1);
      }
    }
  }

  return (
    <>
      <Autocomplete
        disablePortal
        onChange={(event, newValue: any) => {
          if (newValue) {
            setAccountNum(parseInt(newValue));
          }
        }}
        options={data.accountNumbers}
        sx={{ background: 'white', width: '50%', minWidth: '150px', zIndex: 0 }}
        renderInput={(params) => <TextField {...params} value={accountNum} label={"Choose An Account Number"} variant="filled" sx={{ zIndex: 0 }} />}
      /> <br />
      {
        infoPagesLength ?
          <div>
            <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage + 1} <button onClick={() => pageHandler("next")}>Next</button> <br /><br />
            <button onClick={() => downloadHandler("wordDoc")} id="downloadWordDoc" value="download">
              <i className="fas fa-download" />Click Here to Download for MS Word
            </button>
            <button style={{marginLeft: '10px'}} onClick={() => downloadHandler("pdf")} id="downloadPDF" value="download">
              <i className="fas fa-download" />Click Here to Download PDF
            </button> <br /><br />
            <div style={{ backgroundColor: 'white', color: 'black' }} className="content" dangerouslySetInnerHTML={{ __html: (infoPages[currentPage].Info) }}>
            </div>
            <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage + 1} <button onClick={() => pageHandler("next")}>Next</button>
          </div> :
          <h2>Select an Account to continue</h2>
      }
    </>
  );
};

export default GetInfoPages;