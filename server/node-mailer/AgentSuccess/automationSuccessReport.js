"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = (data) => {
  console.log("Sending an email!");

  function buildScheduleCSV() {
    let csvData;
    csvData = 'holiday_id,agent_name,office_city,office_state,holiday,holiday_date,shift_time\n';
    for (let x = 0; x < data.schedule.length; x++) {
      for (let y = 0; y < data.schedule[x].length; y++) {
        if (y == data.schedule[x].length - 1) {
          csvData += `${data.schedule[x][y]}\n`;
        } else {
          csvData += `${data.schedule[x][y]},`;
        }
      }
    }
    return csvData;
  }

  function buildShiftPicksCSV() {
    let csvData;
    csvData = 'agent_name,office_city,office_state,pick_number,holiday,holiday_date,shift_time\n';
    for (let x = 0; x < data.shiftPicks.length; x++) {
      csvData += `${data.shiftPicks[x].employee_name},${data.shiftPicks[x].office_location.replace(/\s/g, "")},${data.shiftPicks[x].pick_number},${data.shiftPicks[x].holiday},${data.shiftPicks[x].holiday_date},${data.shiftPicks[x].shift_time}\n`;
    }
    return csvData;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: process.env.EMAIL_USER_API,
      pass: process.env.EMAIL_PWD_API,
    },
  });

  const attachmentBuilder = () => {
    let attachment = [{
      filename: `Schedule.csv`,
      content: `${buildScheduleCSV()}`
    }, {
      filename: `ShiftPicks.csv`,
      content: `${buildShiftPicksCSV()}`
    }, {
      filename: 'AnSerLogo.png',
      path: './node-mailer/SignatureImage/AnSerLogo.png',
      cid: 'AnSerLogo'
    }
    ]
    return attachment;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    let schedule = data.schedule;
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER_API}`, // sender address
      // to: "stephenm@anser.com; custservice@anser.com", // list of receivers
      // cc: [
      //   'stephenm@anser.com'
      // ],
      to: "stephenm@anser.com",
      subject: "Holiday Sign Up Automation Success", // Subject line
      text: `Please review the Schedule.csv and ShiftPicks.csv documents. You may need to save them as XLSX if you want to do formatting and set up tables in the spreadsheets.`, // plain text body
      html: `${schedule}`, // html body
      attachments: attachmentBuilder()
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
}

module.exports = sendEmail;