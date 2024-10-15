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
  let formattedDate = `${hours[date.getHours()]} ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USER_API,
      pass: process.env.EMAIL_PWD_API,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    let info;
    if (data.urgent == "true") {
      info = await transporter.sendMail({
        from: `${process.env.EMAIL_USER_API}`, // sender address
        to: "programming@anser.com; stephenm@anser.com",  // list of receivers
        // cc: [
        //   'joe@anser.com'
        // ],
        subject: `Bug Report from ${data.fullName} on ${formattedDate}`, // Subject line
        text: `URL: ${data.url} \nDescription:${data.statement}`, // plain text body
        html: `<p>The Problem URL: ${data.url}</p><p>Description of Issue: ${data.statement}</p>`, // html body
      });
    } else {
      info = await transporter.sendMail({
        from: `${process.env.EMAIL_USER_API}`, // sender address
        to: "programming@anser.com",  // list of receivers
        // cc: [
        //   'joe@anser.com'
        // ],
        subject: `Feedback from ${data.fullName} on ${formattedDate}`, // Subject line
        text: `URL: ${data.url} \nDescription:${data.statement}`, // plain text body
        html: `<p>The Problem URL: ${data.url}</p><p>Description of Issue: ${data.statement}</p>`, // html body
      });
    }

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
}

module.exports = sendEmail;