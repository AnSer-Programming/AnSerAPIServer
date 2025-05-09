import React, { useState, useEffect } from 'react';
import { getBackedUpInfoPages, getBackedUpClientSharedFields } from '../../utils/GetDataAPI';
import { toPDF, toMSWord } from '../Utility/DownloadHelper';

const GetInfoPages = (data:any) => {
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
        // let response = new Array();
        let backedUpInfoPages = await getBackedUpInfoPages(data.accountNum, data.date);

        if (!backedUpInfoPages.ok) {
          throw new Error('something went wrong!');
        }

        let backedUpClientSharedFields = await getBackedUpClientSharedFields(data.accountNum, data.date);

        if (!backedUpClientSharedFields.ok) {
          throw new Error('something went wrong!');
        }

        let responseData = new Array();
        responseData[0] = await backedUpInfoPages.json();
        responseData[1] = await backedUpClientSharedFields.json();

        console.log(responseData);

        for (let x = 0; x < responseData[1].length; x++) {
          regex = new RegExp(`(\[CFld\.([A-Za-z0-9]+(_[A-Za-z0-9]+)+)\.${responseData[1][x].client_shared_field_id}\]`);
          otherRegex = new RegExp(`\[CFld\.[A-Za-z0-9]+_-_[A-Za-z0-9]+_[0-9]+\.${responseData[1][x].client_shared_field_id}\]`);
          RegexWithDash = new RegExp(`\[CFld\.[A-Za-z0-9]+_-_[A-Za-z0-9]+-[A-Za-z0-9]+_[0-9]+\.${responseData[1][x].client_shared_field_id}\]`);
          for (let y = 0; y < responseData[0].length; y++) {
            isDone = false;
            while (!isDone) {
              if (responseData[0][y].info_page_data.match(RegexWithDash)) {
                responseData[0][y].info_page_data = await responseData[0][y].info_page_data.replace(RegexWithDash, responseData[1][x].client_shared_field_data);
              }
              else if (responseData[0][y].info_page_data.match(otherRegex)) {
                responseData[0][y].info_page_data = await responseData[0][y].info_page_data.replace(otherRegex, responseData[1][x].client_shared_field_data);
              }
              else if (responseData[0][y].info_page_data.match(regex)) {
                responseData[0][y].info_page_data = await responseData[0][y].info_page_data.replace(regex, responseData[1][x].client_shared_field_data);
              } else {
                isDone = true;
              }
            }
          }
        }

        setData(responseData[0]);
        setMaxPage((responseData[0].length - 1));
      } catch (err) {
        console.error(err);
      }
    };

    getClientsData();
  }, [clientsDataLength, accountNum, data]);

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

  async function downloadHandler() {
    let fileData: string = " ";
    let fileName: string = `${accountNum} ${accountName} Info Pages`;
    let placeHolder: string;
    for (let i = 0; i < infoPages.length; i++) {
      let indexArray: number[] = await findIndex(i, infoPages[i].info_page_data);
      placeHolder = await infoPages[i].info_page_data;
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
    // fileData += "<header><img src='../../assets/img/AnserLogo2.png' /></header>";
    console.log(fileData);
    await toMSWord(fileData, fileName);
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
      {
        infoPagesLength ?
          <div>
            <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage + 1} <button onClick={() => pageHandler("next")}>Next</button> <br /><br />
            {/* <button onClick={downloadHandler} id="downloadCSV" value="download">
              <i className="fas fa-download" />Click Here to Download
            </button> <br /><br /> */}
            <div style={{ backgroundColor: 'white', color: 'black' }} className="content" dangerouslySetInnerHTML={{ __html: (infoPages[currentPage].info_page_data) }}>
            </div>
            <button onClick={() => pageHandler("previous")}>Previous</button> Page: {currentPage + 1} <button onClick={() => pageHandler("next")}>Next</button>
          </div> :
          <h2>Select an Account to continue</h2>
      }
    </>
  );
};

export default GetInfoPages;