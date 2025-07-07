import { jsPDF } from "jspdf";

export const toCSV = (data: any, fileName: string) => {
  let fileType = 'text/csv;charset=utf-8;';
  let blob = new Blob([data as BlobPart], { type: fileType });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = fileName;// simulate link click
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export const toPDF = async (data: any, fileName: string) => {
  const doc = new jsPDF();
  let pageHeight = doc.internal.pageSize.getHeight();
  await doc.html(data[0], {
    callback: async function (doc) {
      // Save the PDF
      if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
          doc.addPage();
          await doc.html(data[i], {
            margin: [10, 10, 10, 10],
            x: 0,
            y: i * pageHeight - (i * 20),
            width: 190, //target width in the PDF document
            windowWidth: 675 //window width in CSS pixels
          });
        }
      }
      doc.save(`${fileName}.pdf`);
    },
    margin: [10, 10, 10, 10],
    x: 0,
    y: 0,
    width: 190, //target width in the PDF document
    windowWidth: 675 //window width in CSS pixels
  });
}

export const toMSWord = async (data: any, fileName: string) => {
  let fileType = 'application/msword';
  let blob = new Blob([data as BlobPart], { type: fileType });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = `${fileName}.doc`;// simulate link click
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}