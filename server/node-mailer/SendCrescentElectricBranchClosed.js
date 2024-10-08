"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const date = new Date();
// const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
// const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", 
//       "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
dotenv.config();

const sendEmail = (data) => {
  console.log("Sending an email!");
  let fileData;
  fileData = `Client Name, Directory Name \n`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
      user: process.env.EMAIL_USER_API,
      pass: process.env.EMAIL_PWD_API,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    let formattedDate = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      to: "stephenm@anser.com", // list of receivers
      // cc: [
      //   'joe@anser.com'
      // ],
      subject: `Crescent Electric Branch Update ${formattedDate}`, // Subject line
      text: `id ${data.id} has been marked as ${data.primary_contact} for Crescent Electric. Reach out and get reach instructions for the branch at id ${data.id}.`, // plain text body
      html: `<p>id ${data.id} has been marked as ${data.primary_contact} for Crescent Electric. Reach out and get reach instructions for the branch at id ${data.id}.</p>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);
}

module.exports = sendEmail;