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
      subject: "Holiday Sign Up Automation Error", // Subject line
      text: `Warning, there was an issue with the Holiday Sign Up Automation`, // plain text body
      html: `${data.errorReport}`, // html body
      attachments: attachmentBuilder()
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);
}

module.exports = sendEmail;