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
    if(!data.fileName) {
      data.fileName = 'missingFile';
    }
    if(!data.fileData) {
      data.fileData = 'missing,data,please,submit,bug,report\r\nthank,you,for,your,patience\r\nSincerely,Stephen,Merki\r\n';
    }
    let attachment = [{
      filename: `${data.fileName}.csv`,
      content: `${data.fileData}`
    },{
      filename: 'AnSerLogo.png',
      path: './node-mailer/SignatureImage/AnSerLogo.png',
      cid: 'AnSerLogo'
    }]
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main(data) {
    // console.log(data.basicReport);
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      // to: "stephenm@anser.com; custservice@anser.com", // list of receivers
      // cc: [
      //   'stephenm@anser.com'
      // ],
      to: "stephenm@anser.com",
      subject: "Holiday Sign Up Automation Note", // Subject line
      text: `Hello,\n\nSomething happened!\n\nThank you,\nAnSer`, // plain text body
      html: `<p>Hello,</p>
      Automation stopped at: ${data ? data.agent_name : 'Agent Name'}<br />
      Reason Automation stopped: ${data ? data.reason : 
        'Reason is currently unavailable. Please reach out to Stephen Merki on either Teams or email at stephenm@anser.com'}<br />
      Shifts selected by this agent: 
      ${data.error == 'NoSelectedShifts' ? 
        `You will need to use the script to either assign preferred picks for the agent or visit the admin site and manually assign a shift for ${data.agent_name}.`: 
      `<ol>
        <li>${data ? data.primaryPick : 'Primary pick unavailable'}</li>
        <li>${data ? data.secondaryPick : 'Secondary pick unavailable'}</li>
        <li>${data ? data.tertiaryPick : 'Tertiary pick unavailable'}</li>
        <li>${data ? data.quaternaryPick : 'Quaternary pick unavailable'}</li>
        <li>${data ? data.quinaryPick : 'Quinary pick unavailable'}</li>
      </ol>`}<br />
      Please view CSV document for available shifts.<br /><br />
      When a shift is assigned use this link to continue automation<br /><br />
      <a href: >Continue Automation</a>
      <p>Thank you,<br />
      AnSer API Server<br />
      <img src='cid:AnSerLogo' width="180"/></p>`, // html body
      attachments: attachmentBuilder()
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);
}

module.exports = sendEmail;