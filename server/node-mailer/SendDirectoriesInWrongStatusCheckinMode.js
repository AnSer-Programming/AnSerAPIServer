"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", 
      "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
dotenv.config();

const sendEmail = (data) => {
  console.log("Sending an email!");
  const date = new Date();
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
    returnData = `<thead><td style='border-bottom: 1px solid; border-right: 1px solid; margin-top: 5px; margin-right: 25px;'>Client Number</td><td style='border-bottom: 1px solid; margin-top: 5px; margin-right: 5px;'>Amount of Undelivered Messages</td></thead>`;
    for(let i = 0; i < data.length; i++ ) {
      returnData += `<tr><td style='border-bottom: 1px solid; border-right: 1px solid; margin-top: 5px;'>${data[i].ClientName}</td><td style='border-bottom: 1px solid; margin-top: 5px;'>${data[i].directory_name}</td></tr>`;
    }
    return returnData;
  }

  const attachmentBuilder = () => {
    let attachment = {
      filename: `Wrong_Status_Checkin_Mode_${formattedDate}.csv`,
      content: `${fileData}`
    }
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      to: "programming@anser.com", // list of receivers
      // cc: [
      //   'joe@anser.com'
      // ],
      subject: "Directories In The Wrong Status Checkin Mode", // Subject line
      text: `Below is a table with Client Names and the Directory Name that belongs to them. These tables are using the incorrect Status Checkin Mode.\n\nIn order to fix this go to the specified directory. Once in there stay in the Subject tab and look inside the General Settings. Now select the drop down list by the label "Status Checkin Mode:" and then select Override Schedule.\n\nThere should also be an attached CSV file that you can open with Microsoft Excel. If the file did not come in the email please submit a support ticket. \n${fileData}`, // plain text body
      html: `<p>Below is a table with Client Names and the Directory Name that belongs to them. These tables are using the incorrect Status Checkin Mode.</p>
      <br />
      <p>In order to fix this go to the specified directory. Once in there stay in the Subject tab and look inside the General Settings. Now select the drop down list by the label "Status Checkin Mode:" and then select Override Schedule.</p>
      <br />
      <p>There should also be an attached CSV file that you can open with Microsoft Excel. If the file did not come in the email please submit a support ticket.</p>
      <br />
      <table>${tableBuilder()}</table>`, // html body
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