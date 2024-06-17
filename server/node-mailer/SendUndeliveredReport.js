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
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`, // sender address
      to: "stephenm@anser.com", // list of receivers additional people:, cristianm@anser.com, custservice@anser.com, ryan@anser.com, samantha@anser.com
      // cc: [
      //   'joe@anser.com'
      // ],
      subject: "Hello ✔", // Subject line
      text: "This is a test email with the company logo embedded into the html body.", // plain text body
      html: `<p>This is a test email</p><p>${JSON.stringify(data)}</p>`, // html body
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