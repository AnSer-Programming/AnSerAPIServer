export const toCSV = (data:any, fileName:string) => {
    let fileType = 'text/csv;charset=utf-8;';
    let blob = new Blob([data as BlobPart], { type: fileType});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = fileName;// simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}