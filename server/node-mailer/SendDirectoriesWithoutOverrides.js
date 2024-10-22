"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const date = new Date();
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", 
      "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
dotenv.config();

const sendEmail = (data) => {
  console.log("Sending an email!");
  let formattedDate = `${days[date.getDay()]} ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} ${hours[date.getHours()]}`;
  let fileData;
  fileData = `Client Name, Directory Name \n`;
  for(let i = 0; i < data.length; i++) {
    fileData += `${data[i].ClientName.replace(',', '')}, ${data[i].directory_name.replace(',', '')} \n`;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USER_API,
      pass: process.env.EMAIL_PWD_API,
    },
  });

  const tableBuilder = () => {
    let returnData;
    returnData = `<thead><td style='border-bottom: 1px solid; border-right: 1px solid; margin-top: 5px; margin-right: 25px;'>Client Name</td><td style='border-bottom: 1px solid; margin-top: 5px; margin-right: 5px;'>Directory Name</td></thead>`;
    for(let i = 0; i < data.length; i++ ) {
      returnData += `<tr><td style='border-bottom: 1px solid; border-right: 1px solid; margin-top: 5px;'>${data[i].ClientName} </td><td style='border-bottom: 1px solid; margin-top: 5px;'>${data[i].directory_name}</td></tr>`;
    }
    return returnData;
  }

  const attachmentBuilder = () => {
    let attachment = {
      filename: `Directories_Missing_Overrides_${formattedDate}.csv`,
      content: `${fileData}`
    }
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      to: "programming@anser.com",  // list of receivers
      // cc: [
      //   'joe@anser.com'
      // ],
      subject: "Directories WITHOUT Any Overrides", // Subject line
      text: `Below is a table with Client Names and the Directory Name that belongs to them. These directories do not have any overrides in them and need to have the default overrides put in place.\n\nThere should also be an attached CSV file that you can open with Microsoft Excel. If the file did not come in the email please submit a support ticket. \n${fileData}`, // plain text body
      html: `<p>Below is a table with Client Names and the Directory Name that belongs to them. These directories do not have any overrides in them and need to have the default overrides put in place.</p><br /><p>There should also be an attached CSV file that you can open with Microsoft Excel. If the file did not come in the email please submit a support ticket.</p><br /><table>${tableBuilder()}</table>`, // html body
      attachments: attachmentBuilder()
    });
  
    console.log("Message sent: %s", info.messageId);
    // send mail with defined transport object
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  main().catch(console.error);
}

module.exports = sendEmail;