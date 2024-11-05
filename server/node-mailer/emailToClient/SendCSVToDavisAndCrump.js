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
    let attachment = {
      filename: `${data.fileName}.csv`,
      content: `${data.fileData}`
    }
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      // to: "rnecaise@myomnitech.com; robert.cain@daviscrump.com; Trevor.Rockstad@daviscrump.com; latrisha.crump@daviscrump.com; leads@daviscrump.com", // list of receivers
      // cc: [
      //   'joe@anser.com', 'stephenm@anser.com'
      // ],
      to: "stephenm@anser.com",
      subject: "Your Daily Report", // Subject line
      text: `Hello,\n\nYour daily report is attached.\n\nThank you,\nAnSer`, // plain text body
      html: `<p>Hello,</p>
      <p>Your daily report is attached.</p>
      <p>Thank you,<br />
      AnSer</p>`, // html body
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