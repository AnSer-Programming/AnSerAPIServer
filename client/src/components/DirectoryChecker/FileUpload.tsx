import React, { useEffect, useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
// const fsp = require('fs').promises; //this file system call allows for async and await

const FileUpload = () => {
  const uploadHandler = async(file:any) => {
    let data;
    console.log('Files:', file);
    // data = await fsp.readFile('KFI Employee Contact List - 25.10.29(1).csv');
    data = await fetch('KFI Employee Contact List - 25.10.29(1).csv?raw');
    if(data) {
      console.log(await data.text());
    }
  }
  return (
    <>
      <DropzoneArea
        onChange={(files) => uploadHandler(files)} />
    </>
  )
}

export default FileUpload;