"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = (data) => {
  console.log("Sending an email!");
  
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

  const attachmentBuilder = () => {
    let attachment = [{
      filename: `${data.fileName}.csv`,
      content: `${data.fileData}`
    },{
      filename: 'AnSerLogo.png',
      path: './node-mailer/SignatureImage/AnSerLogo.png',
      cid: 'AnSerLogo'
    },{
      filename: 'barChart.png',
      path: './scheduled-events/Charts/barChart.png',
      cid: 'barChart'
    },{
      filename: 'barChartLabelsOnly.png',
      path: './scheduled-events/Charts/barChartLabelsOnly.png',
      cid: 'barChartLabelsOnly'
    },{
      filename: 'pieChart.png',
      path: './scheduled-events/Charts/pieChart.png',
      cid: 'pieChart'
    },{
      filename: 'pieChartLabelsOnly.png',
      path: './scheduled-events/Charts/pieChartLabelsOnly.png',
      cid: 'pieChartLabelsOnly'
    },{
      filename: 'polarAreaChart.png',
      path: './scheduled-events/Charts/polarAreaChart.png',
      cid: 'polarAreaChart'
    },{
      filename: 'lineChartScriptProgression.png',
      path: './scheduled-events/Charts/lineChartScriptProgression.png',
      cid: 'lineChartScriptProgression'
    },{
      filename: 'lineChartScriptsCompleted.png',
      path: './scheduled-events/Charts/lineChartScriptsCompleted.png',
      cid: 'lineChartScriptsCompleted'
    },{
      filename: 'lineChartScriptsCompletedWithNumbers.png',
      path: './scheduled-events/Charts/lineChartScriptsCompletedWithNumbers.png',
      cid: 'lineChartScriptsCompletedWithNumbers'
    }]
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    console.log(data.basicReport);
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      to: "stephenm@anser.com; custservice@anser.com", // list of receivers
      // cc: [
      //   'stephenm@anser.com'
      // ],
      // to: "stephenm@anser.com",
      subject: "Your Daily Contact Dispatch Report", // Subject line
      text: `Hello,\n\nYour daily report is attached.\n\nThank you,\nAnSer`, // plain text body
      html: `<p>Hello,</p>
      Accounts Not Started: ${data.basicReport.not_started}<br />
      Accounts In Process: ${data.basicReport.in_process}<br />
      Accounts In Review: ${data.basicReport.in_review}<br />
      Total Not Activated: ${data.basicReport.not_activated}<br />
      Total Activated: ${data.basicReport.activated}</p>
      <p>Below are a couple of charts to display where accounts are currently at in the Contact Dispatch process.</p>
      <img src='cid:barChart' /><br />
      <img src='cid:barChartLabelsOnly' /><br />
      <img src='cid:pieChart' /><br />
      <img src='cid:pieChartLabelsOnly' /><br />
      <img src='cid:polarAreaChart' /><br />
      <img src='cid:lineChartScriptProgression' /><br />
      <img src='cid:lineChartScriptsCompleted' /><br />
      <img src='cid:lineChartScriptsCompletedWithNumbers' /><br />
      <p>Thank you,<br />
      AnSer Programming Team<br />
      <img src='cid:AnSerLogo' width="180"/></p>`, // html body
      attachments: attachmentBuilder()
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);
}

module.exports = sendEmail;